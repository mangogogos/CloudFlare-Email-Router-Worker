import { parseOneAddress } from 'email-addresses';
import type { ParsedMailbox } from 'email-addresses';

interface CloudFlareVariables {
  Email: string; // The destination email address. Format: `actualemail@domain.tld`. Should not include tag i.e. user+tag@domain.tld.
  DirectMailUsers: string; // Email users for which mail is forwarded directly to the destination address. Format: `["user1", "user2"]`.
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
    const destinationAddress = parseEmailAddress(env.Email);
    if (!destinationAddress) {
      message.setReject(`Could not parse destination address: ${env.Email}`);
      return;
    }

    const originalAddress = parseEmailAddress(message.to);
    if (!originalAddress) {
      message.setReject(`Could not parse recipient address: ${message.to}`);
      return;
    }

    const directMailUsers = jsonParseSafe(env.DirectMailUsers);
    if (!Array.isArray(directMailUsers)) {
      message.setReject(`Could not parse direct users: ${env.DirectMailUsers}`);
      return;
    }

    await message.forward(routingLogic(originalAddress, destinationAddress, directMailUsers));
  }
} satisfies ExportedHandler<CloudFlareVariables>;
