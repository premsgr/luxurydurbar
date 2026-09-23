import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST', 'localhost'),
      port: Number(this.config.get('SMTP_PORT', 33016)),
      secure: false,
      auth:
        this.config.get('SMTP_USER') && this.config.get('SMTP_PASS')
          ? {
              user: this.config.get('SMTP_USER'),
              pass: this.config.get('SMTP_PASS'),
            }
          : undefined,
    });
  }

  private from(): string {
    return this.config.get<string>(
      'MAIL_FROM',
      'Luxury Durbar <noreply@luxurydurbar.local>',
    );
  }

  async send(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: this.from(),
        to,
        subject,
        html,
      });
    } catch (err) {
      this.logger.error(`Failed to send mail to ${to}`, err as Error);
    }
  }

  async bookingReceived(params: {
    to: string;
    customerName: string;
    hallName: string;
    eventDate: string;
    startTime: string;
    endTime: string;
  }) {
    await this.send(
      params.to,
      'We received your booking request — Luxury Durbar',
      `<p>Dear ${params.customerName},</p>
       <p>Thank you for requesting <strong>${params.hallName}</strong> on
       <strong>${params.eventDate}</strong> (${params.startTime}–${params.endTime}).</p>
       <p>Our team will review and confirm shortly.</p>
       <p>— Luxury Durbar</p>`,
    );
  }

  async bookingConfirmed(params: {
    to: string;
    customerName: string;
    hallName: string;
    eventDate: string;
  }) {
    await this.send(
      params.to,
      'Booking confirmed — Luxury Durbar',
      `<p>Dear ${params.customerName},</p>
       <p>Your booking for <strong>${params.hallName}</strong> on
       <strong>${params.eventDate}</strong> has been <strong>confirmed</strong>.</p>
       <p>— Luxury Durbar</p>`,
    );
  }

  async bookingRejected(params: {
    to: string;
    customerName: string;
    hallName: string;
    eventDate: string;
  }) {
    await this.send(
      params.to,
      'Booking update — Luxury Durbar',
      `<p>Dear ${params.customerName},</p>
       <p>Unfortunately we could not confirm your request for
       <strong>${params.hallName}</strong> on <strong>${params.eventDate}</strong>.</p>
       <p>Please contact us to discuss alternatives.</p>
       <p>— Luxury Durbar</p>`,
    );
  }

  async staffNewBooking(params: {
    hallName: string;
    customerName: string;
    eventDate: string;
    bookingId: string;
  }) {
    const staffEmail = this.config.get<string>(
      'STAFF_NOTIFY_EMAIL',
      'admin@luxurydurbar.local',
    );
    await this.send(
      staffEmail,
      `New booking request: ${params.hallName}`,
      `<p>New pending booking from <strong>${params.customerName}</strong></p>
       <p>Hall: ${params.hallName}<br/>Date: ${params.eventDate}<br/>ID: ${params.bookingId}</p>`,
    );
  }

  async passwordReset(to: string, resetUrl: string) {
    await this.send(
      to,
      'Reset your Luxury Durbar admin password',
      `<p>Click the link below to reset your password (valid for 1 hour):</p>
       <p><a href="${resetUrl}">${resetUrl}</a></p>`,
    );
  }
}
