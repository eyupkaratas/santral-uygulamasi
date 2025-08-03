namespace SantralOpsAPI.Entities;

public class Randevu : BaseEntity
{
  public string Konu { get; set; }
  public int PersonelId { get; set; }
  public DateTime BitisZamani { get; set; }
  public DateTime BaslangicZamani { get; set; }
  public int KisiId { get; set; }
  public virtual Kisi Kisi { get; set; }
  public virtual Personel Personel { get; set; }
}

