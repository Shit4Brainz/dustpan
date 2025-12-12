## Usage
1. Clone this repository on your computer
2. Create a cards folder in that repository
3. Set up [Cloudflared](https://github.com/cloudflare/cloudflared). This will be what JAI interacts with.
4. Do `pnpm run start` in a terminal, then in another do `cloudflared tunnel --url http://localhost:[PORT]` (port is usually 1336)
5. In the cloudflare terminal there will be a link. You'll know it's the right one because it'll tell you when you visit it.
6. Use this link to set up a proxy normally. The key does not matter. When you do the next step, you want to have your persona have the name "{user}".
7. In order to download any proxy enabled character, simply start a chat with them and send a message.

The proxy will collect the information Janitor AI sends and output to /cards, which can be used with SillyTavern