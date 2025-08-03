using SantralOpsAPI.Enums;

namespace SantralOpsAPI.Entities;

public class Kargo : BaseEntity
{
  public string Gonderen { get; set; }
  public string Aciklama { get; set; }
  public KargoDurum Durum { get; set; } = KargoDurum.Beklemede;
  public string? TakipNumarasi { get; set; }
  public DateTime? TeslimTarihi { get; set; }
  public int TeslimAlanPersonelId { get; set; }
  public virtual Personel? TeslimAlanPersonel { get; set; }
}

