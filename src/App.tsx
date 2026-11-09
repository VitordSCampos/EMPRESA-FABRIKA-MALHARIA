import { AppStateProvider } from "@/shared/state/AppState"
import { ToastProvider } from "@/shared/components/Toast"
import { Layout } from "@/shared/components/Layout/Layout"
import { TelaAtual } from "@/app/routes"

export default function App() {
  return (
    <AppStateProvider>
      <ToastProvider>
        <Layout>
          <TelaAtual />
        </Layout>
      </ToastProvider>
    </AppStateProvider>
  )
}
