import { render, type RenderOptions } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import type { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => (
    <MantineProvider>
        {children}
    </MantineProvider>
);

export function renderWithProviders(
    ui: React.ReactElement,
    options?: RenderOptions
) {
    return render(ui, {
        wrapper: Providers,
        ...options,
    });
}