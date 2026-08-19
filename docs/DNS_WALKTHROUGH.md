# DNS Walkthrough (beginner-friendly)

This is a short, plain-language explanation of how DNS works and the common terms you'll see when pointing a custom domain to your site.

1) What is DNS?
- DNS (Domain Name System) is like the internet's phonebook: it converts human-friendly names (example.com) into the numeric addresses (IP addresses) that computers use to find websites.

2) Nameserver
- A nameserver is the service that stores the DNS records for your domain. When someone types your domain into a browser, their computer asks the nameserver "what IP address is this domain?" and the nameserver answers.

3) Records
- DNS records are entries stored by the nameserver. Common types:
  - A record: maps a domain to an IPv4 address (e.g., 203.0.113.10).
  - AAAA record: maps to an IPv6 address.
  - CNAME record: points one domain name to another domain name (e.g., `www.example.com` → `example.netlify.app`).
  - TXT record: stores text information (used for site verification, email, or other metadata).

4) CNAME vs A record (simple rule)
- Use a CNAME when you want one domain name to point to another domain name (common with Netlify subdomains). Use an A record when you must point directly to an IP address.

5) Resolver
- A DNS resolver is the system (usually run by your ISP or public DNS provider like Google) that looks up DNS records on behalf of the user's browser. It asks the nameserver and returns the answer to the browser.

6) What happens when someone visits your website?
- Step 1: Browser asks a resolver "what is the IP for example.com?".
- Step 2: The resolver queries the nameserver for the domain and reads the DNS record (A, AAAA or CNAME).
- Step 3: Resolver returns the IP or target domain to the browser.
- Step 4: The browser connects to the server (IP) and requests the website content via HTTP(S).

7) When using Netlify
- If you use `yourname.netlify.app` (Netlify subdomain), you usually do not need to touch DNS.
- If you want to use a custom domain you bought (e.g., `yourname.com`), set a CNAME or A record at your domain registrar to point the domain to the Netlify site (Netlify provides specific instructions and a verification TXT record).

8) HTTPS and certificates
- Netlify will automatically provision an HTTPS certificate for your site when DNS is configured correctly. That means visitors get an encrypted connection (the padlock) without manual certificate setup.

9) Quick checklist to connect a domain
- On your domain registrar, open DNS settings.
- Add or edit the record as Netlify instructs (usually a CNAME for subdomains or A records for apex domain).
- Wait for DNS to propagate (minutes to a few hours; sometimes up to 48 hours).
- Verify in Netlify site settings that the domain is verified and HTTPS is active.

If you want, I can add exact sample DNS entries for your registrar once you tell me which registrar you use and whether you want the apex domain (`yourname.com`) or a `www.` subdomain.
