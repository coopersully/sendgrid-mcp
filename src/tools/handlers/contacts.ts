import { SendGridService } from '../../services/sendgrid.js';
import { SendGridContact } from '../../types/index.js';
import { ToolHandler } from '../types.js';
import { requireDestructiveConfirmation } from '../utils.js';

export const contactsToolHandlers: Record<string, ToolHandler> = {
  delete_contacts: async (service: SendGridService, args: Record<string, any>) => {
    requireDestructiveConfirmation(args.confirm_delete, `Deleting ${args.emails.length} contacts`);
    await service.deleteContactsByEmails(args.emails);
    return { content: [{ type: 'text', text: `Successfully deleted ${args.emails.length} contacts` }] };
  },
  list_contacts: async (service: SendGridService, _args: Record<string, any>) => {
    const allContacts = await service.listAllContacts();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            allContacts.map((c) => ({
              email: c.email,
              first_name: c.first_name,
              last_name: c.last_name
            })),
            null,
            2
          )
        }
      ]
    };
  },
  add_contact: async (service: SendGridService, args: Record<string, any>) => {
    await service.addContact(args as SendGridContact);
    return { content: [{ type: 'text', text: `Contact ${args.email} added successfully` }] };
  },
  create_contact_list: async (service: SendGridService, args: Record<string, any>) => {
    const list = await service.createList(args.name);
    return { content: [{ type: 'text', text: `Contact list "${args.name}" created with ID: ${list.id}` }] };
  },
  add_contacts_to_list: async (service: SendGridService, args: Record<string, any>) => {
    await service.addContactsToList(args.list_id, args.emails);
    return { content: [{ type: 'text', text: `Added ${args.emails.length} contacts to list ${args.list_id}` }] };
  },
  get_contacts_by_emails: async (service: SendGridService, args: Record<string, any>) => {
    const contactsByEmails = await service.getContactsByEmails(args.emails);
    return { content: [{ type: 'text', text: JSON.stringify(contactsByEmails, null, 2) }] };
  },
  get_contact_by_id: async (service: SendGridService, args: Record<string, any>) => {
    const contactById = await service.getContactById(args.contact_id);
    return { content: [{ type: 'text', text: JSON.stringify(contactById, null, 2) }] };
  },
  get_total_contact_count: async (service: SendGridService, _args: Record<string, any>) => {
    const totalContactCount = await service.getTotalContactCount();
    return { content: [{ type: 'text', text: JSON.stringify(totalContactCount, null, 2) }] };
  },
  get_contact_list: async (service: SendGridService, args: Record<string, any>) => {
    const contactList = await service.getList(args.list_id);
    return { content: [{ type: 'text', text: JSON.stringify(contactList, null, 2) }] };
  },
  update_contact_list: async (service: SendGridService, args: Record<string, any>) => {
    const updatedContactList = await service.updateList(args.list_id, args.name);
    return { content: [{ type: 'text', text: JSON.stringify(updatedContactList, null, 2) }] };
  },
  get_list_contact_count: async (service: SendGridService, args: Record<string, any>) => {
    const listContactCount = await service.getListContactCount(args.list_id);
    return { content: [{ type: 'text', text: JSON.stringify(listContactCount, null, 2) }] };
  },
  delete_list: async (service: SendGridService, args: Record<string, any>) => {
    requireDestructiveConfirmation(args.confirm_delete, `Deleting contact list ${args.list_id}`);
    await service.deleteList(args.list_id);
    return { content: [{ type: 'text', text: `Contact list ${args.list_id} deleted successfully` }] };
  },
  list_contact_lists: async (service: SendGridService, _args: Record<string, any>) => {
    const lists = await service.listContactLists();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            lists.map((l) => ({
              id: l.id,
              name: l.name,
              contact_count: l.contact_count
            })),
            null,
            2
          )
        }
      ]
    };
  },
  get_contacts_by_list: async (service: SendGridService, args: Record<string, any>) => {
    const contacts = await service.getContactsByList(args.list_id);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            contacts.map((c) => ({
              email: c.email,
              first_name: c.first_name,
              last_name: c.last_name
            })),
            null,
            2
          )
        }
      ]
    };
  },
  remove_contacts_from_list: async (service: SendGridService, args: Record<string, any>) => {
    await service.removeContactsFromList(args.list_id, args.emails);
    return { content: [{ type: 'text', text: `Removed ${args.emails.length} contacts from list ${args.list_id}` }] };
  }
};
