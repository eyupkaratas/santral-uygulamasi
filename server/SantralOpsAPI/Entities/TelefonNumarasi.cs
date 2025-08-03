namespace SantralOpsAPI.Entities;

public class TelefonNumarasi : BaseEntity
{
  public string Numara { get; set; }
  public int KisiId { get; set; }
  public virtual Kisi Kisi { get; set; }
}
