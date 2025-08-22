import { Modal, type ModalProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Suspense, useEffect } from "react";

export function DetailsModal({
	children,
	onClose,
	...props
}: {
	children: React.ReactNode;
	onClose: () => void;
} & Pick<ModalProps, "title" | "fullScreen" | "closeOnClickOutside" | "size">) {
	const [opened, { open, close }] = useDisclosure(false);

	useEffect(() => {
		setTimeout(open, 1);
	}, [open]);

	return (
		<Modal
			opened={opened}
			onClose={close}
			transitionProps={{ onExited: onClose }}
			overlayProps={{ backgroundOpacity: 0.3, blur: 4 }}
			{...props}
		>
			<Suspense>{children}</Suspense>
		</Modal>
	);
}
