using System.Text.RegularExpressions;

namespace SantralOpsAPI.Helpers;

public static class PhoneNumberHelper
{
  public static string Normalize(string phoneNumber)
  {
    if (string.IsNullOrWhiteSpace(phoneNumber))
    {
      return string.Empty;
    }

    var digitsOnly = Regex.Replace(phoneNumber, @"[^\d]", "");

    if (digitsOnly.Length == 11 && digitsOnly.StartsWith("0"))
    {
      digitsOnly = digitsOnly.Substring(1);
    }
    if (digitsOnly.Length == 10)
    {
      return $"+90{digitsOnly}";
    }

    return phoneNumber;
  }
}
