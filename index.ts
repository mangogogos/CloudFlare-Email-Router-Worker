interface CloudFlareVariables {
  Email: string; // The destination email address. Format: `actualemail@domain.tld`
  DirectMailUsers: string; // Email users for which mail is forwarded directly to the destination address. Format: `["user1", "user2"]`
}

export default {
  async email(message: ForwardableEmailMessage, env: CloudFlareVariables, ctx: ExecutionContext): Promise<void> {
    const [intendedUser] = message.to.split('@');
    const [destinationUser, destinationDomain] = env.Email.split('@');
    const directMailUsers = JSON.parse(env.DirectMailUsers);

    const destinationTag = directMailUsers.includes(intendedUser)
      ? ''
      : `+${intendedUser}`;

    await message.forward(`${destinationUser}${destinationTag}@${destinationDomain}`);
  }
} satisfies ExportedHandler<CloudFlareVariables>;
