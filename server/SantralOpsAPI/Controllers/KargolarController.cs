using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using SantralOpsAPI.DTOs;
using SantralOpsAPI.Entities;
using SantralOpsAPI.Enums;
using SantralOpsAPI.Persistence;

namespace SantralOpsAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KargolarController(SantralOpsDbContext context) : ControllerBase
{
  private readonly SantralOpsDbContext _context = context;

  // GET: api/Kargolar
  [HttpGet]
  public async Task<ActionResult<IEnumerable<KargoOzetDto>>> GetKargolar()
  {
    var kargolar = await _context.Kargolar
        .Include(k => k.TeslimAlanPersonel)
        .Select(k => new KargoOzetDto
        {
          Id = k.Id,
          TakipNumarasi = k.TakipNumarasi,
          Gonderen = k.Gonderen,
          Aciklama = k.Aciklama,
          Durum = k.Durum.ToString(),
          TeslimAlanPersonelAdi = k.TeslimAlanPersonel.AdSoyad,
          CreatedDate = k.CreatedDate,
          TeslimTarihi = k.TeslimTarihi
        })
        .OrderByDescending(k => k.CreatedDate)
        .ToListAsync();

    return Ok(kargolar);
  }

  // POST: api/Kargolar
  [HttpPost]
  [Authorize(Roles = "Admin, Operator")]
  public async Task<ActionResult<KargoOzetDto>> PostKargo(KargoGirisDto kargoDto)
  {
    var personelVarMi = await _context.Personeller.AnyAsync(p => p.Id == kargoDto.TeslimAlanPersonelId);
    if (!personelVarMi)
    {
      return BadRequest("Geçersiz 'TeslimAlanPersonelId': Bu ID'ye sahip bir personel bulunamadı.");
    }

    var kargo = new Kargo
    {
      TakipNumarasi = kargoDto.TakipNumarasi,
      Gonderen = kargoDto.Gonderen,
      Aciklama = kargoDto.Aciklama,
      TeslimAlanPersonelId = kargoDto.TeslimAlanPersonelId
    };

    _context.Kargolar.Add(kargo);
    await _context.SaveChangesAsync();

    var personel = await _context.Personeller.FindAsync(kargo.TeslimAlanPersonelId);
    var responseDto = new KargoOzetDto
    {
      Id = kargo.Id,
      TakipNumarasi = kargo.TakipNumarasi,
      Gonderen = kargo.Gonderen,
      Aciklama = kargo.Aciklama,
      Durum = kargo.Durum.ToString(),
      TeslimAlanPersonelAdi = personel.AdSoyad,
      CreatedDate = kargo.CreatedDate,
      TeslimTarihi = kargo.TeslimTarihi
    };

    return CreatedAtAction(nameof(GetKargolar), new { id = kargo.Id }, responseDto);
  }

  // PUT: api/Kargolar/{id}
  [HttpPut("{id}/teslimet")]
  [Authorize(Roles = "Admin, Operator")]
  public async Task<IActionResult> TeslimEt(int id)
  {
    var kargo = await _context.Kargolar.FindAsync(id);
    if (kargo == null)
    {
      return NotFound();
    }

    if (kargo.Durum == KargoDurum.TeslimEdildi)
    {
      return BadRequest("Bu kargo zaten teslim edilmiş.");
    }

    kargo.Durum = KargoDurum.TeslimEdildi;
    kargo.TeslimTarihi = DateTime.UtcNow;
    kargo.UpdatedDate = DateTime.UtcNow;

    await _context.SaveChangesAsync();
    return NoContent();
  }
}
