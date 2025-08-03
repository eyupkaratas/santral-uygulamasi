using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using SantralOpsAPI.Entities;
using SantralOpsAPI.Enums;

namespace SantralOpsAPI.Persistence;

public static class DataSeeder
{
  private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
  {
    using var hmac = new HMACSHA512();
    passwordSalt = hmac.Key;
    passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
  }

  public static async Task SeedAsync(SantralOpsDbContext context)
  {
    if (context.Birimler.Any()) return;

    var birimler = new List<Birim>
        {
            new() { Ad = "Bilgi İşlem Dairesi Başkanlığı" },
            new() { Ad = "İnsan Kaynakları ve Eğitim Dairesi Başkanlığı" },
            new() { Ad = "Fen İşleri Dairesi Başkanlığı" },
            new() { Ad = "Kent Estetiği Dairesi Başkanlığı" },
            new() { Ad = "Emlak ve İstimlak Dairesi Başkanlığı" },
            new() { Ad = "İmar ve Şehircilik Dairesi Başkanlığı" },
            new() { Ad = "Santral" }
        };
    await context.Birimler.AddRangeAsync(birimler);
    await context.SaveChangesAsync();

    var personeller = new List<Personel>();
    string defaultPassword = "123456";

    var personelData = new[] {
            new { AdSoyad = "Zeynep Kaya", Unvan = "Daire Başkanı", Dahili = "1000", Eposta = "zeynep.kaya@belediye.gov.tr", BirimId = 0, Rol = "Admin" },
new { AdSoyad = "Ahmet Çelik", Unvan = "Yazılım Geliştirme Şube Müdürü", Dahili = "1001", Eposta = "ahmet.celik@belediye.gov.tr", BirimId = 0, Rol = "DepartmentUser" },
new { AdSoyad = "Selin Arslan", Unvan = "Kıdemli Yazılım Geliştirici", Dahili = "1010", Eposta = "selin.arslan@belediye.gov.tr", BirimId = 0, Rol = "DepartmentUser" },
new { AdSoyad = "Eyüp Karataş", Unvan = "Yazılım Geliştirici", Dahili = "1011", Eposta = "eyup.karatas@belediye.gov.tr", BirimId = 0, Rol = "DepartmentUser" },
new { AdSoyad = "Deniz Öztürk", Unvan = "Sistem ve Ağ Şube Müdürü", Dahili = "1002", Eposta = "deniz.ozturk@belediye.gov.tr", BirimId = 0, Rol = "DepartmentUser" },
new { AdSoyad = "Ozan Doğan", Unvan = "Sistem Uzmanı", Dahili = "1020", Eposta = "ozan.dogan@belediye.gov.tr", BirimId = 0, Rol = "DepartmentUser" },
new { AdSoyad = "Kerem Aydın", Unvan = "Daire Başkanı", Dahili = "2000", Eposta = "kerem.aydin@belediye.gov.tr", BirimId = 1, Rol = "Admin" },
new { AdSoyad = "Ebru Şahin", Unvan = "Şube Müdürü", Dahili = "2001", Eposta = "ebru.sahin@belediye.gov.tr", BirimId = 1, Rol = "DepartmentUser" },
new { AdSoyad = "Volkan Demir", Unvan = "İK Uzmanı", Dahili = "2010", Eposta = "volkan.demir@belediye.gov.tr", BirimId = 1, Rol = "DepartmentUser" },
new { AdSoyad = "Ceren Yıldırım", Unvan = "Eğitim Sorumlusu", Dahili = "2011", Eposta = "ceren.yildirim@belediye.gov.tr", BirimId = 1, Rol = "DepartmentUser" },
new { AdSoyad = "Levent Polat", Unvan = "Memur", Dahili = "2012", Eposta = "levent.polat@belediye.gov.tr", BirimId = 1, Rol = "DepartmentUser" },
new { AdSoyad = "İsmail Can", Unvan = "Daire Başkanı", Dahili = "3000", Eposta = "ismail.can@belediye.gov.tr", BirimId = 2, Rol = "Admin" },
new { AdSoyad = "Gökhan Gür", Unvan = "Yol Yapım Şube Müdürü", Dahili = "3001", Eposta = "gokhan.gur@belediye.gov.tr", BirimId = 2, Rol = "DepartmentUser" },
new { AdSoyad = "Merve Kılıç", Unvan = "İnşaat Mühendisi", Dahili = "3010", Eposta = "merve.kilic@belediye.gov.tr", BirimId = 2, Rol = "DepartmentUser" },
new { AdSoyad = "Furkan Koç", Unvan = "Tekniker", Dahili = "3011", Eposta = "furkan.koc@belediye.gov.tr", BirimId = 2, Rol = "DepartmentUser" },
new { AdSoyad = "Yusuf Aslan", Unvan = "Şef", Dahili = "3005", Eposta = "yusuf.aslan@belediye.gov.tr", BirimId = 2, Rol = "DepartmentUser" },
new { AdSoyad = "Tarkan Efe", Unvan = "Saha Sorumlusu", Dahili = "3012", Eposta = "tarkan.efe@belediye.gov.tr", BirimId = 2, Rol = "DepartmentUser" },
new { AdSoyad = "Pınar Aksoy", Unvan = "Daire Başkanı", Dahili = "4000", Eposta = "pinar.aksoy@belediye.gov.tr", BirimId = 3, Rol = "Admin" },
new { AdSoyad = "Büşra Çetin", Unvan = "Peyzaj Mimarı", Dahili = "4010", Eposta = "busra.cetin@belediye.gov.tr", BirimId = 3, Rol = "DepartmentUser" },
new { AdSoyad = "Onur Tuncel", Unvan = "Şehir Plancısı", Dahili = "4011", Eposta = "onur.tuncel@belediye.gov.tr", BirimId = 3, Rol = "DepartmentUser" },
new { AdSoyad = "Serkan Yavuz", Unvan = "Grafik Tasarımcı", Dahili = "4012", Eposta = "serkan.yavuz@belediye.gov.tr", BirimId = 3, Rol = "DepartmentUser" },
new { AdSoyad = "Gamze Ulusoy", Unvan = "Sanat Yönetmeni", Dahili = "4001", Eposta = "gamze.ulusoy@belediye.gov.tr", BirimId = 3, Rol = "DepartmentUser" },
new { AdSoyad = "Umut Keskin", Unvan = "Daire Başkanı", Dahili = "5000", Eposta = "umut.keskin@belediye.gov.tr", BirimId = 4, Rol = "Admin" },
new { AdSoyad = "Eren Bulut", Unvan = "Şube Müdürü", Dahili = "5001", Eposta = "eren.bulut@belediye.gov.tr", BirimId = 4, Rol = "DepartmentUser" },
new { AdSoyad = "Tolga Korkmaz", Unvan = "Emlak Uzmanı", Dahili = "5010", Eposta = "tolga.korkmaz@belediye.gov.tr", BirimId = 4, Rol = "DepartmentUser" },
new { AdSoyad = "Gizem Özdemir", Unvan = "Değerleme Uzmanı", Dahili = "5011", Eposta = "gizem.ozdemir@belediye.gov.tr", BirimId = 4, Rol = "DepartmentUser" },
new { AdSoyad = "Emre Ateş", Unvan = "Memur", Dahili = "5012", Eposta = "emre.ates@belediye.gov.tr", BirimId = 4, Rol = "DepartmentUser" },
new { AdSoyad = "Hande Sarı", Unvan = "Daire Başkanı", Dahili = "6000", Eposta = "hande.sari@belediye.gov.tr", BirimId = 5, Rol = "Admin" },
new { AdSoyad = "İrem Durmaz", Unvan = "Şube Müdürü", Dahili = "6001", Eposta = "irem.durmaz@belediye.gov.tr", BirimId = 5, Rol = "DepartmentUser" },
new { AdSoyad = "Çağla Erdem", Unvan = "Mimar", Dahili = "6010", Eposta = "cagla.erdem@belediye.gov.tr", BirimId = 5, Rol = "DepartmentUser" },
new { AdSoyad = "Hakan Vural", Unvan = "Şehir Plancısı", Dahili = "6011", Eposta = "hakan.vural@belediye.gov.tr", BirimId = 5, Rol = "DepartmentUser" },
new { AdSoyad = "Aslı Kara", Unvan = "Harita Mühendisi", Dahili = "6012", Eposta = "asli.kara@belediye.gov.tr", BirimId = 5, Rol = "DepartmentUser" },
new { AdSoyad = "Oğuzhan Toprak", Unvan = "Proje Sorumlusu", Dahili = "6013", Eposta = "oguzhan.toprak@belediye.gov.tr", BirimId = 5, Rol = "DepartmentUser" },
new { AdSoyad = "Barış Yalçın", Unvan = "Santral Operatörü", Dahili = "0001", Eposta = "baris.yalcin@belediye.gov.tr", BirimId = 6, Rol = "Operator" },
new { AdSoyad = "Uğurcan Tekin", Unvan = "Santral Operatörü", Dahili = "0002", Eposta = "ugurcan.tekin@belediye.gov.tr", BirimId = 6, Rol = "Operator" },
new { AdSoyad = "Koray Avcı", Unvan = "Santral Operatörü", Dahili = "0003", Eposta = "koray.avci@belediye.gov.tr", BirimId = 6, Rol = "Operator" }
        };

    foreach (var pData in personelData)
    {
      CreatePasswordHash(defaultPassword, out byte[] hash, out byte[] salt);
      personeller.Add(new Personel
      {
        AdSoyad = pData.AdSoyad,
        Unvan = pData.Unvan,
        Dahili = pData.Dahili,
        Eposta = pData.Eposta,
        BirimId = birimler[pData.BirimId].Id,
        Rol = pData.Rol,
        PasswordHash = hash,
        PasswordSalt = salt
      });
    }
    await context.Personeller.AddRangeAsync(personeller);
    await context.SaveChangesAsync();

    var ilkKisi = new Kisi { AdSoyad = "Ali Veli", Notlar = "Daha önce su kesintisi için aramıştı." };
    ilkKisi.TelefonNumaralari.Add(new TelefonNumarasi { Numara = "+905551112233" });
    await context.Kisiler.AddAsync(ilkKisi);
    await context.SaveChangesAsync();

    var ilkPersonel = await context.Personeller.FirstAsync();
    var ilkTelefonNumarasi = await context.TelefonNumaralari.FirstAsync();

    var tickets = new List<Ticket>
        {
            new() { Konu = "Su Faturası Hakkında Bilgi", Aciklama = "Son gelen su faturam çok yüksek.", TalebiYapanKisiId = ilkKisi.Id, OlusturanPersonelId = ilkPersonel.Id, AtananPersonelId = ilkPersonel.Id },
            new() { Konu = "Parktaki Kırık Oyuncaklar", Aciklama = "Mahalle parkındaki salıncak kırık.", TalebiYapanKisiId = ilkKisi.Id, OlusturanPersonelId = ilkPersonel.Id },


        };
    await context.Tickets.AddRangeAsync(tickets);

    var aramaKayitlari = new List<TelefonAramaKaydi>
        {
            new() { Yonu = AramaYonu.Gelen, Notlar = "Fatura hakkında bilgi aldı.", TelefonNumarasiId = ilkTelefonNumarasi.Id, PersonelId = ilkPersonel.Id },
            new() { Yonu = AramaYonu.Giden, Notlar = "Geri arama yapıldı.", TelefonNumarasiId = ilkTelefonNumarasi.Id, PersonelId = ilkPersonel.Id, AramaZamani = DateTime.UtcNow.AddHours(-1) }

        };
    await context.TelefonAramaKayitlari.AddRangeAsync(aramaKayitlari);

    await context.SaveChangesAsync();
  }
}
