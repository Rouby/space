import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Suspense, useEffect } from "react";

export function DetailsDrawer({
	size,
	children,
	onClose,
}: { size: string; children: React.ReactNode; onClose: () => void }) {
	const [opened, { open, close }] = useDisclosure(false);

	useEffect(() => {
		setTimeout(open, 1);
	}, [open]);

	return (
		<Drawer
			opened={opened}
			onClose={close}
			transitionProps={{ onExited: onClose }}
			position="right"
			size={size}
			withCloseButton={false}
			overlayProps={{ backgroundOpacity: 0.3, blur: 4 }}
		>
			<Suspense>{children}</Suspense>
		</Drawer>
	);
}
