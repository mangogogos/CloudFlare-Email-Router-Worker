import { parseOneAddress, type ParsedMailbox } from 'email-addresses';

interface CloudFlareVariables {
  DESTINATION_EMAIL: string; // The destination email address. Format: `actualemail@domain.tld`. Should not include tag i.e. user+tag@domain.tld.
  DIRECT_EMAIL_USERS: string; // Email users for which mail is forwarded directly to the destination address. Format: `["user1", "user2"]`.
}

const jsonParseSafe = (value: string): string | null => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const parseEmailAddress = (addressString: string): ParsedMailbox | null => {
  const parsed = parseOneAddress(addressString);
  return parsed?.type === 'mailbox' ? parsed : null;
};

const routingLogic = (originalAddress: ParsedMailbox, destinationAddress: ParsedMailbox, directMailUsers: string[]): string => {
  const [originalUser, originalTag = ''] = originalAddress.local.split('+');

  let tag = originalTag
  if (!directMailUsers.includes(originalUser)) {
    tag = originalTag ? `${originalUser}-${originalTag}` : originalUser;
  }

  return `${destinationAddress.local}+${tag}@${destinationAddress.domain}`;
};

export default {
  async email(message: ForwardableEmailMessage, env: CloudFlareVariables): Promise<void> {
    const directMailUsers = jsonParseSafe(env.DIRECT_EMAIL_USERS);
    const destinationAddress = parseEmailAddress(env.DESTINATION_EMAIL);
    if (!Array.isArray(directMailUsers) ||!destinationAddress) {
      console.error('Failed to parse environment variables', JSON.stringify(env))
      message.setReject('Internal server error');
      return;
    }

    const originalAddress = parseEmailAddress(message.to);
    if (!originalAddress) {
      message.setReject(`Could not parse recipient address: ${message.to}`);
      return;
    }

    await message.forward(routingLogic(originalAddress, destinationAddress, directMailUsers));
  }
} satisfies ExportedHandler<CloudFlareVariables>;
