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
public class TicketsController(SantralOpsDbContext context) : ControllerBase
{
  private readonly SantralOpsDbContext _context = context;

  // GET: api/Tickets
  [HttpGet]
  public async Task<ActionResult<IEnumerable<TicketOzetDto>>> GetTickets()
  {
    var tickets = await _context.Tickets
        .Include(t => t.TalebiYapanKisi)
        .Include(t => t.OlusturanPersonel)
        .Include(t => t.AtananPersonel)
        .Select(t => new TicketOzetDto
        {
          Id = t.Id,
          Konu = t.Konu,
          Aciklama = t.Aciklama,
          Durum = t.Durum.ToString(),
          Oncelik = t.Oncelik.ToString(),
          TalebiYapanKisi = t.TalebiYapanKisi.AdSoyad,
          AtananPersonelId = t.AtananPersonelId,
          OlusturanPersonel = t.OlusturanPersonel.AdSoyad,
          AtananPersonel = t.AtananPersonel != null ? t.AtananPersonel.AdSoyad : "Atanmadı",
          CreatedDate = t.CreatedDate
        })
        .OrderByDescending(t => t.CreatedDate)
        .ToListAsync();

    return Ok(tickets);
  }

  // POST: api/Tickets
  [HttpPost]
  [Authorize(Roles = "Admin, Operator")]
  public async Task<ActionResult<TicketOzetDto>> PostTicket(TicketOlusturDto ticketDto)
  {
    var olusturanPersonelVarMi = await _context.Personeller.AnyAsync(p => p.Id == ticketDto.OlusturanPersonelId);
    if (!olusturanPersonelVarMi)
      return BadRequest("Geçersiz 'OlusturanPersonelId': Bu ID'ye sahip bir personel bulunamadı.");

    if (ticketDto.AtananPersonelId.HasValue)
    {
      var atananPersonelVarMi = await _context.Personeller.AnyAsync(p => p.Id == ticketDto.AtananPersonelId.Value);
      if (!atananPersonelVarMi)
        return BadRequest("Geçersiz 'AtananPersonelId': Bu ID'ye sahip bir personel bulunamadı.");
    }

    if (string.IsNullOrWhiteSpace(ticketDto.TalebiYapanKisiNumarasi))
      return BadRequest("Talebi yapan kişinin telefon numarası boş olamaz.");

    var normalizedNumber = PhoneNumberHelper.Normalize(ticketDto.TalebiYapanKisiNumarasi);

    var telefonKaydi = await _context.TelefonNumaralari
        .Include(t => t.Kisi)
        .FirstOrDefaultAsync(t => t.Numara == normalizedNumber);

    Kisi talebiYapanKisi;

    if (telefonKaydi != null)
    {
      talebiYapanKisi = telefonKaydi.Kisi;
    }
    else
    {
      if (string.IsNullOrWhiteSpace(ticketDto.TalebiYapanKisiAdi))
        return BadRequest("Yeni kişi oluşturmak için adı boş olamaz.");

      talebiYapanKisi = new Kisi { AdSoyad = ticketDto.TalebiYapanKisiAdi };
      var yeniNumara = new TelefonNumarasi { Numara = normalizedNumber, Kisi = talebiYapanKisi };
      _context.TelefonNumaralari.Add(yeniNumara);
    }

    var ticket = new Ticket
    {
      Konu = ticketDto.Konu,
      Aciklama = ticketDto.Aciklama,
      TalebiYapanKisi = talebiYapanKisi,
      OlusturanPersonelId = ticketDto.OlusturanPersonelId,
      AtananPersonelId = ticketDto.AtananPersonelId
    };

    _context.Tickets.Add(ticket);
    await _context.SaveChangesAsync();

    var olusturanPersonel = await _context.Personeller.FindAsync(ticket.OlusturanPersonelId);
    var atananPersonel = ticket.AtananPersonelId.HasValue ? await _context.Personeller.FindAsync(ticket.AtananPersonelId.Value) : null;

    var responseDto = new TicketOzetDto
    {
      Id = ticket.Id,
      Konu = ticket.Konu,
      Aciklama = ticket.Aciklama,
      Durum = ticket.Durum.ToString(),
      Oncelik = ticket.Oncelik.ToString(),
      TalebiYapanKisi = talebiYapanKisi.AdSoyad,
      OlusturanPersonel = olusturanPersonel.AdSoyad,
      AtananPersonelId = ticket.AtananPersonelId,
      AtananPersonel = atananPersonel != null ? atananPersonel.AdSoyad : "Atanmadı",
      CreatedDate = ticket.CreatedDate
    };

    return CreatedAtAction(nameof(GetTickets), new { id = ticket.Id }, responseDto);
  }

  // PUT: api/Tickets/{id}
  [HttpPut("{id}")]
  [Authorize(Roles = "Admin, Operator")]
  public async Task<IActionResult> PutTicket(int id, TicketGuncelleDto ticketDto)
  {
    var ticket = await _context.Tickets.FindAsync(id);
    if (ticket == null)
    {
      return NotFound();
    }

    if (ticketDto.AtananPersonelId.HasValue)
      ticket.AtananPersonelId = ticketDto.AtananPersonelId;

    if (ticketDto.Durum.HasValue)
      ticket.Durum = ticketDto.Durum.Value;

    if (ticketDto.Oncelik.HasValue)
      ticket.Oncelik = ticketDto.Oncelik.Value;

    ticket.UpdatedDate = System.DateTime.UtcNow;

    await _context.SaveChangesAsync();
    return NoContent();
  }
}
