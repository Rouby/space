import { Box, Button, Text } from "@mantine/core";
import { vars } from "../../theme";

export function GridCell({
	row,
	col,
	componentId,
	component,
	onRemove,
}: {
	row: number;
	col: number;
	componentId: string | null;
	component: { id: string; name: string } | undefined;
	onRemove: (row: number, col: number) => void;
}) {
	return (
		<Box
			style={{
				border: `1px dashed ${vars.colors.gray[5]}`,
				backgroundColor: componentId ? vars.colors.gray[1] : "transparent",
				height: "60px",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				position: "relative",
			}}
		>
			{component && (
				<>
					<Text ta="center" size="xs">
						{component.name}
					</Text>
					<Button
						variant="subtle"
						color="red"
						size="xs"
						style={{
							position: "absolute",
							top: 2,
							right: 2,
							padding: 2,
							minWidth: "auto",
							width: 16,
							height: 16,
						}}
						onClick={() => onRemove(row, col)}
					>
						×
					</Button>
				</>
			)}
		</Box>
	);
}
