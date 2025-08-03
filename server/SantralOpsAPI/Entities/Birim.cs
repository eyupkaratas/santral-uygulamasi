namespace SantralOpsAPI.Entities;

public class Birim : BaseEntity
{
  public string Ad { get; set; }
  public virtual ICollection<Personel> Personeller { get; set; } = [];
}
