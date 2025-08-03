using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SantralOpsAPI.DTOs;
using SantralOpsAPI.Entities;
using SantralOpsAPI.Persistence;

namespace SantralOpsAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PersonellerController(SantralOpsDbContext context) : ControllerBase
{
  private readonly SantralOpsDbContext _context = context;

  // GET: api/Personeller
  [HttpGet]
  public async Task<ActionResult<IEnumerable<PersonelDetayDto>>> GetPersoneller([FromQuery] int? birimId)
  {
    var query = _context.Personeller.Include(p => p.Birim).AsQueryable();

    if (birimId.HasValue && birimId > 0)
    {
      query = query.Where(p => p.BirimId == birimId.Value);
    }

    var personeller = await query.ToListAsync();

    var siraliPersoneller = personeller
        .OrderBy(p => GetUnvanSira(p.Unvan))
        .ThenBy(p => p.AdSoyad)
        .Select(p => new PersonelDetayDto
        {
          Id = p.Id,
          AdSoyad = p.AdSoyad,
          Unvan = p.Unvan,
          DahiliNo = p.Dahili,
          Eposta = p.Eposta,
          Rol = p.Rol,
          Birim = new BirimTemelDto { Id = p.Birim.Id, Ad = p.Birim.Ad }
        })
        .ToList();

    return Ok(siraliPersoneller);
  }

  // GET: api/Personeller/{id}
  [HttpGet("{id}")]
  public async Task<ActionResult<PersonelDetayDto>> GetPersonel(int id)
  {
    var personelDto = await _context.Personeller
        .Where(p => p.Id == id)
        .Include(p => p.Birim)
        .Select(p => new PersonelDetayDto
        {
          Id = p.Id,
          AdSoyad = p.AdSoyad,
          Unvan = p.Unvan,
          DahiliNo = p.Dahili,
          Eposta = p.Eposta,
          Rol = p.Rol,
          Birim = new BirimTemelDto { Id = p.Birim.Id, Ad = p.Birim.Ad }
        })
        .FirstOrDefaultAsync();

    if (personelDto == null)
    {
      return NotFound();
    }

    return Ok(personelDto);
  }

  // POST: api/Personeller
  [HttpPost]
  [Authorize(Roles = "Admin")]
  public async Task<ActionResult<PersonelDetayDto>> PostPersonel(PersonelOlusturGuncelleDto personelDto)
  {
    if (await _context.Personeller.AnyAsync(p => p.Eposta == personelDto.Eposta))
      return BadRequest("Bu e-posta adresi zaten kullanılıyor.");

    if (await _context.Personeller.AnyAsync(p => p.BirimId == personelDto.BirimId && p.Dahili == personelDto.Dahili))
      return BadRequest("Bu birimde belirtilen dahili numara zaten kullanılıyor.");

    CreatePasswordHash(personelDto.Sifre, out byte[] passwordHash, out byte[] passwordSalt);

    var yeniPersonel = new Personel
    {
      AdSoyad = personelDto.AdSoyad,
      Unvan = personelDto.Unvan,
      Dahili = personelDto.Dahili,
      Eposta = personelDto.Eposta,
      PasswordHash = passwordHash,
      PasswordSalt = passwordSalt,
      BirimId = personelDto.BirimId,
      Rol = personelDto.Rol
    };

    _context.Personeller.Add(yeniPersonel);
    await _context.SaveChangesAsync();

    var olusturulanPersonelDto = new PersonelDetayDto
    {
      Id = yeniPersonel.Id,
      AdSoyad = yeniPersonel.AdSoyad,
      Unvan = yeniPersonel.Unvan,
      DahiliNo = yeniPersonel.Dahili,
      Eposta = yeniPersonel.Eposta,
      Rol = yeniPersonel.Rol,
      Birim = new BirimTemelDto { Id = yeniPersonel.BirimId, Ad = _context.Birimler.Find(yeniPersonel.BirimId).Ad }
    };

    return CreatedAtAction(nameof(GetPersonel), new { id = yeniPersonel.Id }, olusturulanPersonelDto);
  }

  // PUT: api/Personeller/{id}
  [HttpPut("{id}")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> PutPersonel(int id, PersonelOlusturGuncelleDto personelDto)
  {
    var personel = await _context.Personeller.FindAsync(id);
    if (personel == null)
    {
      return NotFound();
    }

    personel.AdSoyad = personelDto.AdSoyad;
    personel.Unvan = personelDto.Unvan;
    personel.Dahili = personelDto.Dahili;
    personel.Eposta = personelDto.Eposta;
    personel.BirimId = personelDto.BirimId;
    personel.Rol = personelDto.Rol;
    personel.UpdatedDate = DateTime.UtcNow;

    if (!string.IsNullOrWhiteSpace(personelDto.Sifre))
    {
      CreatePasswordHash(personelDto.Sifre, out byte[] passwordHash, out byte[] passwordSalt);
      personel.PasswordHash = passwordHash;
      personel.PasswordSalt = passwordSalt;
    }

    await _context.SaveChangesAsync();
    return NoContent();
  }

  // DELETE: api/Personeller/{id}
  [HttpDelete("{id}")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> DeletePersonel(int id)
  {
    var personel = await _context.Personeller.FindAsync(id);
    if (personel == null)
    {
      return NotFound();
    }

    _context.Personeller.Remove(personel);
    await _context.SaveChangesAsync();

    return NoContent();
  }

  private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
  {
    using var hmac = new HMACSHA512();
    passwordSalt = hmac.Key;
    passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
  }

  private static int GetUnvanSira(string unvan)
  {
    return unvan.ToLower() switch
    {
      "daire başkanı" => 1,
      var u when u.Contains("müdürü") => 2,
      "şef" => 3,
      "sanat yönetmeni" => 3,
      "proje sorumlusu" => 4,
      var u when u.Contains("kıdemli") => 10,
      var u when u.Contains("uzmanı") => 11,
      var u when u.Contains("mühendisi") => 12,
      var u when u.Contains("mimar") => 12,
      var u when u.Contains("geliştirici") => 12,
      var u when u.Contains("plancısı") => 12,
      var u when u.Contains("tasarımcı") => 13,
      var u when u.Contains("sorumlusu") => 14,
      "santral operatörü" => 14,
      var u when u.Contains("tekniker") => 15,
      "memur" => 98,
      _ => 99
    };
  }
}
