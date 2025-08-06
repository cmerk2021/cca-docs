---
layout: main.njk
title: "Privacy Notice"
nav: "Privacy Notice"
category: "Telephony"
order: 1
---

# Privacy Notice

<div style="padding: 15px; background-color: #dddddd; border-radius: 5px;">
    <p class="govuk-body">
        <b>In short:</b>
        <ul class="govuk-list govuk-list--bullet">
            <li>Users are expected to use and administer the system in good faith in a way that doesn’t violate the rights of others.</li>
            <li>However, technical limitations in the product as well as limitations of the way the product was deployed make it impossible to guarantee privacy.</li>
            <li>Users may elect to receive endpoint devices that have local hardware microphone and speaker interlocks/cut-outs.</li>
        </ul>
    </p>
</div>

<br>

The use of the UC system is designed to enable users to learn about how the system works and to enable zero-cost communication between users. 

Users are expected to use the system and its administrative tools in a way that does not violate the rights - including privacy - of other users. 

Despite this, limitations in the *product design* and the *deployment* of the system make it impossible to guarantee privacy.

## Background and key definitions

The unified communications (UC) system and related support network have many components and each have their own privacy and security risks.

The IP endpoints assigned to users contain one or more microphone, speaker, and/or camera. Users should be aware of how each of these components work

### Key definitions:

- **Unified Communications/UC** <br> 
All traffic relating to voice and video for collaboration and calls.

- **Target traffic**<br>
All UC traffic and related supporting infrastructure traffic is considered target traffic.

- **_Non_-Target traffic**<br>
All traffic *unrelated* to UC, such as general internet traffic.

- **VPN appliance**<br>
A box (usually a *Cisco Meraki MX*) that enable target traffic to cross physical location with minimal thought or interference by the end user.

## Privacy risks related to using the UC system:

### Risk of remote listening/eavesdropping device enablement

**Problem:**<br>
IP endpoints can be configured to automatically answer calls without ringing or showing anything on the display, enabling clandestine eavesdropping. Additionally, software such as PhoneView can enable remote microphone streaming, further enabling evesdropping.

**Aggravating factors:**<br>
All users of the CUCM software have the same level of administrative access.

**Solution:**<br>
Users can request specially made endpoint devices that have a local microphone/speaker cutout that prevents speech from being transmitted even if calls are remotely initiated because the only way to enable the microphone and speaker is to physically press a button on the endpoint device. The CIS Secure DTD-8851-01-NS is deployed for this use case and is TSG Approved for government applications with similar risks.

### Risk of wiretapping of voice traffic

**Problem:**<br>
IP endpoints are deployed with unencrypted SIP, enabling users to wiretap voice conversations by making a packet capture of the SIP traffic. Free and open source tools, such as Wireshark, contain features that enable extraction of audio files from SIP datagrams. 

**Solution:**<br>
Users can connect their phone via encrypted SIP and can ensure that the people they call have encrypted SIP too. They can also chose to not hold sensitive conversations on the system.

### Risk of wiretapping of non-target data traffic on PC ports

**Problem:** <br>
IP endpoints typically have two network interfaces - the switch or `SW` port which connects the phone to the data network (and usually provides power) and the `PC` port which provides an extra ethernet port for a personal computer or other device. Due to the insecure nature of the deployment, it is possible for users to perform packet captures of non-target traffic made through the PC port.

**Solution:**<br>
Do not send unencrypted traffic over any PC interface that you do not want packet captured. This generally means not using the PC port at all.

## Privacy risks related to using a site to site VPN appliance:

The site to site VPN appliance used in this network is a Cisco Meraki MX or Z3/Z4 appliance. This appliance allows for remote connectivity without manual configuration or management. 

There are two operating modes - full appliance mode and VPN concentrator mode. These modes are better explained in the site to site VPN appliance documentation.
In short: 
- **full appliance mode** means you connect the phones directly to the MX and it does a full (double or triple) NAT setup and routes all site to site traffic through itself.
- **VPN concentrator mode** means your MX sits as a client on your network and you’ll need to set a static route for other networks within your own router. It is notable that in this mode the “LAN” ports of the Meraki act similar to switch ports of your own network, meaning you can use the spare Meraki ports as additional switch ports. This use of extra ports is not suggested because it introduces *non-target traffic* through UC equipment which has its own privacy concerns.

### Risk of wiretapping of non-target traffic on Meraki appliances

**Problem:**<br>
All interfaces (ports) on Meraki appliances have the native ability to run packet captures. This means if you use any of the Meraki ports for non-UC traffic, it is possible for any other users to run packet captures and to get a copy of all data transferred on that interface.

**Solution:**<br>
Do not send unencrypted traffic over any Meraki interface that you do not want packet captured. This generally means only connecting the phones to the LAN ports of the Meraki.