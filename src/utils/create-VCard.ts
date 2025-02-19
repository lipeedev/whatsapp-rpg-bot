type CreateVCardParams = {
  name: string,
  phone: string,
  recruiter: string
}

export function createVCard({ name, phone, recruiter }: CreateVCardParams) {
  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    `TEL;type=CELL;type=VOICE;waid=${phone.replace(/\W/g, '').trim()}:${phone}`,
    `ORG:Recrutado por ${recruiter}`,
    'END:VCARD'
  ].join('\n');

  return vCard;
}

