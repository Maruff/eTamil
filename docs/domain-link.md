To link a domain registered through GoDaddy to a GitHub Pages site using Cloudflare for DNS management and enhanced security, follow these steps:

### Prerequisites

1. **GitHub Pages site:** Ensure your site is deployed and accessible via the default GitHub Pages URL (e.g., `your-username.github.io`).
2. **Domain registered with GoDaddy:** You have a domain name registered with GoDaddy.
3. **Cloudflare account:** Create a free Cloudflare account if you don't have one.

### Step-by-Step Guide

#### 1. Add Your Domain to Cloudflare

1. **Log in to Cloudflare:**
   - Go to [Cloudflare](https://www.cloudflare.com) and log in to your account.

2. **Add Your Site:**
   - Click the **Add Site** button.
   - Enter your domain name (e.g., `example.com`) and click **Add site**.
   
3. **Select a Plan:**
   - Choose the **Free Plan** and click **Confirm Plan**.

4. **Cloudflare Scans DNS Records:**
   - Cloudflare will scan your current DNS records. Review and confirm the records.
   
5. **Change Name Servers:**
   - Cloudflare will provide you with two new name servers. Note these down.

#### 2. Update Name Servers in GoDaddy

1. **Log in to GoDaddy:**
   - Go to [GoDaddy](https://www.godaddy.com) and log in to your account.

2. **Access Domain Settings:**
   - Navigate to **My Products** and find your domain.
   - Click on **DNS** or **Manage DNS** next to your domain.

3. **Change Name Servers:**
   - Scroll down to the **Name Servers** section.
   - Click **Change** or **Manage**.
   - Select **Enter my own nameservers (advanced)**.
   - Enter the Cloudflare name servers provided earlier.
   - Click **Save** and confirm the changes.

#### 3. Configure DNS Records in Cloudflare

1. **Log in to Cloudflare:**
   - Return to your Cloudflare dashboard and select your domain.

2. **Add DNS Records:**
   - Go to the **DNS** tab.
   - Add the following DNS records:

   - **A Record for the Root Domain:**
     ```plaintext
     Type: A
     Name: @
     IPv4 address: 192.30.252.153
     TTL: Auto
     Proxy status: Proxied
     ```
     Add another A record with the same settings but with `IPv4 address: 192.30.252.154`.

   - **CNAME Record for www:**
     ```plaintext
     Type: CNAME
     Name: www
     Target: your-username.github.io
     TTL: Auto
     Proxy status: Proxied
     ```

3. **Add Page Rule (Optional):**
   - Go to the **Rules** tab in Cloudflare.
   - Click **Create Page Rule**.
   - Enter `example.com/*` in the URL pattern field (replace `example.com` with your domain).
   - Add a setting for **Always Use HTTPS**.
   - Click **Save and Deploy**.

#### 4. Configure GitHub Pages

1. **Configure Custom Domain in GitHub:**
   - Go to your GitHub repository.
   - Click on **Settings**.
   - Scroll down to the **GitHub Pages** section.
   - Under **Custom domain**, enter your domain name (e.g., `example.com`).
   - Save the changes.

2. **Verify Your Site:**
   - It might take a few minutes for DNS changes to propagate. Once done, visit your domain (e.g., `example.com`), and it should now point to your GitHub Pages site.

### Additional Tips

- **HTTPS Configuration:**
  - Cloudflare automatically provides HTTPS for your domain. Ensure that the **Always Use HTTPS** setting is enabled in Cloudflare to redirect all HTTP traffic to HTTPS.

- **DNS Propagation:**
  - DNS changes can take some time to propagate fully. It might take up to 24-48 hours in some cases.

By following these steps, you can successfully link a domain registered through GoDaddy to a GitHub Pages site using Cloudflare for DNS management and enhanced security.
