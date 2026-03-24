import { NextResponse } from "next/server";
import { getAuthUser, unauthorized, badRequest } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

const templates: Record<string, { emailSubject: string; email: (c: string, comp: string) => string; text: (c: string, comp: string) => string }> = {
  "quote-follow": {
    emailSubject: "Your Hardscaping Quote — Ready When You Are",
    email: (c, comp) => `Hi ${c.split(" ")[0]},

Hope you're doing well! I wanted to follow up on the quote we put together for your project.

Spring is our busiest season — locking in now guarantees your preferred start date. Current Techo-Bloc pricing is valid through next month, and we can adjust the scope or payment terms if needed.

Would you like to hop on a quick call this week to go over any questions? I'm happy to walk through the details.

Looking forward to building something great for you.

Best,
${comp}`,
    text: (c, comp) => `Hi ${c.split(" ")[0]}! It's ${comp}. Just following up on your hardscaping quote. Spring slots are filling up fast — want to lock in your dates? Happy to chat if you have any Qs.`,
  },
  "job-complete": {
    emailSubject: "Your Project is Complete!",
    email: (c, comp) => `Hi ${c.split(" ")[0]},

Great news — your hardscaping project is officially complete!

Our crew finished up today and everything looks fantastic. A few care tips:
• Wait 24 hours before placing heavy furniture
• Avoid power washing for 30 days (polymeric sand needs to fully cure)
• Your 5-year workmanship warranty starts today

We'll send the final invoice separately. If you love the results, a quick Google review would mean the world to us!

Thank you for trusting ${comp} with your project.

Best regards,
${comp}`,
    text: (c, comp) => `Hi ${c.split(" ")[0]}! Your project is DONE! Everything looks amazing. Quick reminder: wait 24hrs before heavy furniture, no power washing for 30 days. Your 5-year warranty starts today. Enjoy! — ${comp}`,
  },
  "schedule-confirm": {
    emailSubject: "Your Hardscaping Project — Schedule Confirmed",
    email: (c, comp) => `Hi ${c.split(" ")[0]},

This is a friendly confirmation that your hardscaping project is scheduled to begin soon.

Our crew will arrive between 7:30–8:00 AM on the start date. Please ensure the work area is accessible and any vehicles are moved from the driveway/work zone.

What to expect on Day 1:
• Crew arrives and sets up
• Materials delivered (if not already on site)
• Site preparation and layout marking begins

If you have any questions or need to adjust the schedule, please don't hesitate to reach out.

We're excited to get started!

Best,
${comp}`,
    text: (c, comp) => `Hi ${c.split(" ")[0]}! Confirming your project is scheduled to start soon. Crew arrives 7:30-8AM. Please clear the work area and move vehicles. Questions? Just text us! — ${comp}`,
  },
  "payment-reminder": {
    emailSubject: "Friendly Payment Reminder",
    email: (c, comp) => `Hi ${c.split(" ")[0]},

I hope you're enjoying your new outdoor space! I wanted to send a friendly reminder that we have an outstanding balance on your account.

We understand things can get busy, so please don't hesitate to reach out if you'd like to discuss payment options or have any questions about the invoice.

You can pay by e-transfer, cheque, or credit card — whatever's most convenient.

Thank you for your prompt attention to this matter.

Best regards,
${comp}`,
    text: (c, comp) => `Hi ${c.split(" ")[0]}, friendly reminder about your outstanding balance with ${comp}. You can pay by e-transfer, cheque, or credit card. Please reach out if you have any questions!`,
  },
  "seasonal-promo": {
    emailSubject: "Spring Special — Transform Your Outdoor Space",
    email: (c, comp) => `Hi ${c.split(" ")[0]},

Spring is the perfect time to upgrade your outdoor living space, and we have something special for you.

For a limited time, ${comp} is offering:
• 10% off all patio installations booked this month
• Free polymeric sand upgrade on projects over $10,000
• Priority scheduling for returning customers

Whether it's a new patio, walkway, retaining wall, or fire pit area — we'd love to help you create the outdoor space you've been dreaming of.

Want a free estimate? Reply to this email or give us a call!

Best,
${comp}`,
    text: (c, comp) => `Hi ${c.split(" ")[0]}! Spring special from ${comp}: 10% off patio installations booked this month + free polymeric sand upgrade on $10K+ projects. Want a free estimate? Just reply!`,
  },
  "review-request": {
    emailSubject: "Quick Favor — Would You Leave Us a Review?",
    email: (c, comp) => `Hi ${c.split(" ")[0]},

I hope you're still enjoying your hardscaping project! We had a great time working on it.

If you have 2 minutes, it would mean the world to us if you could leave a quick Google review. Honest reviews from real customers are the #1 way other homeowners find and trust us.

Just search "${comp}" on Google and click "Write a Review" — even a few sentences help!

Thank you so much for your support. We truly appreciate it.

Best,
${comp}`,
    text: (c, comp) => `Hi ${c.split(" ")[0]}! Hope you're loving the new outdoor space! Would you mind leaving us a quick Google review? Just search "${comp}" and click "Write a Review." It really helps us out! Thanks!`,
  },
  "warranty-check": {
    emailSubject: "Annual Warranty Check-In",
    email: (c, comp) => `Hi ${c.split(" ")[0]},

It's been about a year since we completed your hardscaping project, and I wanted to check in!

As a reminder, your project comes with our 5-year workmanship warranty. If you've noticed any settling, shifting, or drainage issues, please let us know — we'll come take a look at no charge.

Quick maintenance tips for this season:
• Sweep sand joints to prevent weed growth
• Re-apply polymeric sand if joints look empty
• Check for any edge restraint movement

Would you like us to schedule a quick inspection? It's free and takes about 15 minutes.

Best regards,
${comp}`,
    text: (c, comp) => `Hi ${c.split(" ")[0]}! Annual check-in from ${comp}. Your 5-year warranty is still active. Noticed any settling or drainage issues? We'll come look for free. Want to schedule a 15-min inspection?`,
  },
  "referral-ask": {
    emailSubject: "Know Someone Who Needs Hardscaping?",
    email: (c, comp) => `Hi ${c.split(" ")[0]},

I hope you're still enjoying your outdoor space! We loved working on your project.

If you know any friends, family, or neighbors who are thinking about hardscaping, we'd be grateful for the referral. As a thank you, we offer a $250 referral bonus for every project that gets booked.

Just have them mention your name when they contact us, and we'll take care of the rest!

Thank you for your continued support.

Best,
${comp}`,
    text: (c, comp) => `Hi ${c.split(" ")[0]}! Know anyone who needs hardscaping? We offer a $250 referral bonus for every booked project. Just have them mention your name when they call ${comp}!`,
  },
};

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();
  if (!body.customerId || !body.template || !body.type)
    return badRequest("Customer, template, and type (email/text) are required");

  const customer = await prisma.customer.findFirst({
    where: { id: body.customerId, userId: user.id },
  });
  if (!customer) return badRequest("Customer not found");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  const companyName = dbUser?.companyName || dbUser?.name || "Your Company";

  const tmpl = templates[body.template];
  if (!tmpl) return badRequest("Unknown template");

  const content = body.type === "email" ? tmpl.email(customer.name, companyName) : tmpl.text(customer.name, companyName);
  const subject = body.type === "email" ? tmpl.emailSubject : null;

  // Save to database
  const message = await prisma.message.create({
    data: {
      type: body.type,
      template: body.template,
      subject,
      content,
      status: "draft",
      userId: user.id,
      customerId: body.customerId,
    },
    include: {
      customer: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json({ ...message, subject, content });
}
