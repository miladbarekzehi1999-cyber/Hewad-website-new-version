import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Support() {
  return (
    <div className="min-h-screen w-full py-10 px-4 bg-background text-foreground">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Page Title */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold">پشتیبانی</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            اگر در استفاده از خدمات ما مشکلی دارید، تیم پشتیبانی آماده کمک‌رسانی است.
          </p>
        </div>

        {/* Contact Information */}
        <Card className="border rounded-xl shadow">
          <CardHeader>
            <CardTitle className="text-2xl">راه‌های تماس</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7">
            <p><strong>نام مالک:</strong> میلاد بارکزی</p>
            <p><strong>ایمیل:</strong> <a className="text-blue-500 hover:underline" href="mailto:barekzey@proton.me">barekzey@proton.me</a></p>
            <p><strong>تلفن / واتس‌اپ:</strong> <a className="text-blue-500 hover:underline" href="tel:+989304186823">+989304186823</a></p>
            <p><strong>تلگرام:</strong> <a className="text-blue-500 hover:underline" href="https://t.me/barekzey">@barekzey</a></p>
            <p><strong>ساعات کاری:</strong> شنبه تا پنج‌شنبه — 09:00 تا 18:00</p>
          </CardContent>
        </Card>

        {/* Support Steps */}
        <Card className="border rounded-xl shadow">
          <CardHeader>
            <CardTitle className="text-2xl">چگونه درخواست پشتیبانی ثبت کنم؟</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>مشکل را به صورت کوتاه توضیح دهید.</li>
              <li>در صورت نیاز، عکس یا شناسه سفارش را ارسال کنید.</li>
              <li>راه ارتباطی موردنظر را انتخاب کنید (ایمیل، تلگرام، واتس‌اپ).</li>
              <li>در موارد فوری با واتس‌اپ تماس بگیرید.</li>
            </ol>
          </CardContent>
        </Card>

        {/* Quick Contact Form */}
        <Card className="border rounded-xl shadow">
          <CardHeader>
            <CardTitle className="text-2xl">فرم تماس سریع</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action="https://formsubmit.co/barekzey@proton.me"
              method="POST"
              className="space-y-4"
            >
              <input type="hidden" name="_subject" value="درخواست پشتیبانی جدید" />

              <div className="space-y-1">
                <label className="text-sm">نام</label>
                <input className="w-full p-2 rounded border bg-background" name="name" required />
              </div>

              <div className="space-y-1">
                <label className="text-sm">ایمیل</label>
                <input className="w-full p-2 rounded border bg-background" name="email" type="email" required />
              </div>

              <div className="space-y-1">
                <label className="text-sm">شماره تماس (اختیاری)</label>
                <input className="w-full p-2 rounded border bg-background" name="phone" />
              </div>

              <div className="space-y-1">
                <label className="text-sm">موضوع</label>
                <input className="w-full p-2 rounded border bg-background" name="subject" required />
              </div>

              <div className="space-y-1">
                <label className="text-sm">توضیحات</label>
                <textarea
                  rows={4}
                  className="w-full p-2 rounded border bg-background"
                  name="message"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                ارسال
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center">
          <Link to="/">
            <Button variant="secondary" className="px-6">
              بازگشت
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
