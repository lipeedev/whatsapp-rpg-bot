import { writeFileSync, existsSync, readFileSync } from "fs";
import { Contact } from "@whiskeysockets/baileys";

export function updateContacts(newContacts: Pick<Contact, 'id' | 'name'>[]) {
  const path = './contacts.json';

  try {
    const existingContacts = existsSync(path)
      ? JSON.parse(readFileSync(path, 'utf-8'))
      : [];

    const contactMap = new Map<string, Contact>();
    existingContacts.forEach((c: Contact) => contactMap.set(c.id, c));
    newContacts.forEach(c => contactMap.set(c.id, c));

    writeFileSync(path, JSON.stringify(Array.from(contactMap.values()), null, 2));
  } catch (error) {
    console.error('Erro ao salvar contatos')
  }
}
