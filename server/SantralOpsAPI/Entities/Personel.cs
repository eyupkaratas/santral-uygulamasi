namespace SantralOpsAPI.Entities;

public class Personel : BaseEntity
{
  public string AdSoyad { get; set; }
  public string Dahili { get; set; }
  public string Eposta { get; set; }
  public string Unvan { get; set; }
  public string Rol { get; set; }
  public byte[] PasswordHash { get; set; }
  public byte[] PasswordSalt { get; set; }
  public int BirimId { get; set; }
  public virtual Birim Birim { get; set; }
}
