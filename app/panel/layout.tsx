// Cada página arma su encabezado; las listas suman la barra de abajo.
export default function PanelLayout({ children }: LayoutProps<"/panel">) {
  return <div className="flex flex-1 flex-col bg-muted">{children}</div>;
}
