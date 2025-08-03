using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using SantralOpsAPI.DTOs;
using SantralOpsAPI.Entities;
using SantralOpsAPI.Persistence;

namespace SantralOpsAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RandevularController(SantralOpsDbContext context) : ControllerBase
{
  private readonly SantralOpsDbContext _context = context;

  // GET: api/Randevular
  [HttpGet]
  public async Task<ActionResult<IEnumerable<RandevuOzetDto>>> GetRandevular()
  {
    var randevular = await _context.Randevular
        .Include(r => r.Personel)
        .Include(r => r.Kisi)
        .Select(r => new RandevuOzetDto
        {
          Id = r.Id,
          Konu = r.Konu,
          BaslangicZamani = r.BaslangicZamani,
          BitisZamani = r.BitisZamani,
          PersonelAdi = r.Personel.AdSoyad,
          KisiAdi = r.Kisi.AdSoyad
        })
        .OrderBy(r => r.BaslangicZamani)
        .ToListAsync();

    return Ok(randevular);
  }

  // POST: api/Randevular
  [HttpPost]
  [Authorize(Roles = "Admin, Operator")]
  public async Task<ActionResult<RandevuOzetDto>> PostRandevu(RandevuOlusturDto randevuDto)
  {
    var personelVarMi = await _context.Personeller.AnyAsync(p => p.Id == randevuDto.PersonelId);
    if (!personelVarMi)
    {
      return BadRequest(new { status = 401, message = "Bu ID'ye sahip bir personel bulunaamdı." });
    }

    var kisiVarMi = await _context.Kisiler.AnyAsync(k => k.Id == randevuDto.KisiId);
    if (!kisiVarMi)
    {
      return BadRequest(new { status = 401, message = "Bu ID'ye sahip bir kişi bulunaamdı." });
    }

    var cakisanRandevuVarMi = await _context.Randevular
        .AnyAsync(r => r.PersonelId == randevuDto.PersonelId &&
                       randevuDto.BaslangicZamani < r.BitisZamani &&
                       randevuDto.BitisZamani > r.BaslangicZamani);

    if (cakisanRandevuVarMi)
    {
      return BadRequest("Belirtilen zaman aralığında bu personel için başka bir randevu bulunmaktadır.");
    }

    var randevu = new Randevu
    {
      Konu = randevuDto.Konu,
      BaslangicZamani = randevuDto.BaslangicZamani,
      BitisZamani = randevuDto.BitisZamani,
      PersonelId = randevuDto.PersonelId,
      KisiId = randevuDto.KisiId
    };

    _context.Randevular.Add(randevu);
    await _context.SaveChangesAsync();

    var olusturulanRandevu = await _context.Randevular
        .Where(r => r.Id == randevu.Id)
        .Include(r => r.Personel)
        .Include(r => r.Kisi)
        .Select(r => new RandevuOzetDto
        {
          Id = r.Id,
          Konu = r.Konu,
          BaslangicZamani = r.BaslangicZamani,
          BitisZamani = r.BitisZamani,
          PersonelAdi = r.Personel.AdSoyad,
          KisiAdi = r.Kisi.AdSoyad
        }).FirstAsync();

    return CreatedAtAction(nameof(GetRandevular), new { id = randevu.Id }, olusturulanRandevu);
  }
}
