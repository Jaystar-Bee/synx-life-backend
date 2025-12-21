// export const verifyActualEmail = (email: string): boolean => {
//   const isValid = email
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//     );

// };

export function generateRandomNumbers(digits: number = 4): string {
  let otp = '';
  for (let i = 0; i < digits; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}
