using Microsoft.EntityFrameworkCore;
using SantralOpsAPI.Entities;

namespace SantralOpsAPI.Persistence;

public class SantralOpsDbContext(DbContextOptions<SantralOpsDbContext> options) : DbContext(options)
{
  public DbSet<Birim> Birimler { get; set; }
  public DbSet<Personel> Personeller { get; set; }
  public DbSet<Kisi> Kisiler { get; set; }
  public DbSet<TelefonNumarasi> TelefonNumaralari { get; set; }
  public DbSet<Ticket> Tickets { get; set; }
  public DbSet<Randevu> Randevular { get; set; }
  public DbSet<Kargo> Kargolar { get; set; }
  public DbSet<TelefonAramaKaydi> TelefonAramaKayitlari { get; set; }
}
