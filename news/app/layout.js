export const metadata = {
  title: 'NewsHub',
  description: 'World News Portal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}