namespace SantralOpsAPI.DTOs;

public class PersonelDetayDto
{
  public int Id { get; set; }
  public string AdSoyad { get; set; }
  public string Unvan { get; set; }
  public string DahiliNo { get; set; }
  public string Eposta { get; set; }
  public string Rol { get; set; }
  public BirimTemelDto Birim { get; set; }
}
