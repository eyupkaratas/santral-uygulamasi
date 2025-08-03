namespace SantralOpsAPI.Entities;

public class Kisi : BaseEntity
{
  public string AdSoyad { get; set; }
  public string? Notlar { get; set; }
  public virtual ICollection<TelefonNumarasi> TelefonNumaralari { get; set; } = new List<TelefonNumarasi>();
}
