using SantralOpsAPI.Enums;

namespace SantralOpsAPI.Entities;

public class TelefonAramaKaydi : BaseEntity
{
  public AramaYonu Yonu { get; set; }
  public DateTime AramaZamani { get; set; } = DateTime.UtcNow;
  public string? Notlar { get; set; }
  public int TelefonNumarasiId { get; set; }
  public virtual TelefonNumarasi TelefonNumarasi { get; set; } = null!;
  public int PersonelId { get; set; }
  public virtual Personel Personel { get; set; } = null!;
}
