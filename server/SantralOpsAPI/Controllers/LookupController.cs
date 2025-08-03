using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using SantralOpsAPI.DTOs;
using SantralOpsAPI.Entities;
using SantralOpsAPI.Helpers;
using SantralOpsAPI.Persistence;

namespace SantralOpsAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LookupController(SantralOpsDbContext context) : ControllerBase
{
  private readonly SantralOpsDbContext _context = context;

  [HttpGet]
  public async Task<ActionResult<IEnumerable<GenelAramaKaydiDto>>> GetTumAramalar()
  {
    var sonAramalar = await _context.TelefonAramaKayitlari
        .Include(a => a.TelefonNumarasi)
            .ThenInclude(tn => tn.Kisi)
        .Include(a => a.Personel)
        .OrderByDescending(a => a.AramaZamani)
        .Take(50)
        .Select(a => new GenelAramaKaydiDto
        {
          Id = a.Id,
          KisiAdSoyad = a.TelefonNumarasi.Kisi.AdSoyad,
          Numara = a.TelefonNumarasi.Numara,
          Yonu = a.Yonu.ToString(),
          AramaZamani = a.AramaZamani,
          PersonelAdi = a.Personel.AdSoyad,
          Notlar = a.Notlar
        })
        .ToListAsync();

    return Ok(sonAramalar);
  }

  [HttpPost]
  public async Task<IActionResult> LogCall(AramaKaydiOlusturDto aramaDto)
  {
    var normalizedNumber = PhoneNumberHelper.Normalize(aramaDto.Numara);
    if (string.IsNullOrEmpty(normalizedNumber))
    {
      return BadRequest(new { status = 400, message = "Geçersiz telefon numarası formatı." });
    }

    var telefonNumarasi = await _context.TelefonNumaralari
        .Include(t => t.Kisi)
        .FirstOrDefaultAsync(t => t.Numara == normalizedNumber);

    if (telefonNumarasi == null)
    {
      if (string.IsNullOrWhiteSpace(aramaDto.YeniKisiAdi))
      {
        return BadRequest(new { status = 400, message = "Numara kayıtlı değil. Yeni kişi oluşturmak için 'YeniKisiAdi' alanı zorunludur." });
      }

      var yeniKisi = new Kisi { AdSoyad = aramaDto.YeniKisiAdi };
      telefonNumarasi = new TelefonNumarasi { Numara = normalizedNumber, Kisi = yeniKisi };
      _context.TelefonNumaralari.Add(telefonNumarasi);
    }

    var aramaKaydi = new TelefonAramaKaydi
    {
      TelefonNumarasi = telefonNumarasi,
      Yonu = aramaDto.Yonu,
      PersonelId = aramaDto.PersonelId,
      Notlar = aramaDto.Notlar
    };

    _context.TelefonAramaKayitlari.Add(aramaKaydi);
    await _context.SaveChangesAsync();
    return StatusCode(201, new { id = aramaKaydi.Id });
  }
}