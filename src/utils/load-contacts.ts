import { Contact } from "@whiskeysockets/baileys";
import { existsSync, readFileSync } from "fs";

export function loadContacts() {
  const path = './contacts.json';

  if (!existsSync(path)) {
    return []
  }

  const contacts = readFileSync(path).toString() ?? '[]'
  return JSON.parse(contacts) as Pick<Contact, 'id' | 'name'>[]
}
