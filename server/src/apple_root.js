// Apple Root CA - G3 (ECC P-384) 루트 인증서.
//
// 출처: Apple PKI https://www.apple.com/certificateauthority/  → "Apple Root CA - G3 Root" (AppleRootCA-G3.cer)
// 지문(SHA-256)은 같은 페이지의 안내로 확인한다.
//
// 이 값은 외워서 적을 수 없는 긴 인증서라, 확실하지 않은 값을 넣지 않고 자리표시자로 둔다.
// 받는 법(README 참고):
//   curl -O https://www.apple.com/certificateauthority/AppleRootCA-G3.cer
//   openssl x509 -inform der -in AppleRootCA-G3.cer -out AppleRootCA-G3.pem
// 나온 PEM 을 아래 문자열에 붙여 넣거나, 비밀값 APPLE_ROOT_CA_G3_PEM 으로 넣는다(비밀값이 우선).
export const APPLE_ROOT_CA_G3_PEM = `-----BEGIN CERTIFICATE-----
PLACEHOLDER_APPLE_ROOT_CA_G3_FILL_FROM_APPLE_PKI
-----END CERTIFICATE-----`;

export function isPlaceholderPem(pem) {
  return !pem || pem.includes('PLACEHOLDER');
}
