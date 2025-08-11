import { Box, Button, Text } from "@mantine/core";
import { useStyles } from "tss-react";
import { theme } from "../../theme";

export function GridCell({
	row,
	col,
	component,
	onRemove,
}: {
	row: number;
	col: number;
	component: { id: string; name: string } | undefined;
	onRemove: (row: number, col: number) => void;
}) {
	const { css } = useStyles();

	return (
		<Box
			className={css({
				border: component
					? `1px solid ${theme.colors.blue[5]}`
					: `1px dashed ${theme.colors.gray[5]}`,
				backgroundColor: component ? "rgba(0, 120, 255, 0.2)" : "transparent",
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				position: "relative",
				transition: "all 0.2s ease-in-out",
				boxSizing: "border-box",
				padding: theme.spacing.xs,
				boxShadow: component ? "inset 0 0 8px rgba(0, 120, 255, 0.4)" : "none",
				borderRadius: "2px",
				overflow: "hidden",
			})}
		>
			{component && (
				<>
					<Text
						ta="center"
						size="xs"
						fw={600}
						className={css({
							wordBreak: "break-word",
							maxWidth: "100%",
							position: "relative",
							zIndex: 1,
							color: "rgba(255, 255, 255, 0.95)",
							textShadow: "0 0 4px rgba(0, 60, 120, 0.9)",
							padding: "2px 4px",
							borderRadius: "2px",
						})}
					>
						{component.name}
					</Text>
					<Button
						variant="filled"
						color="red"
						size="xs"
						className={css({
							position: "absolute",
							top: 2,
							right: 2,
							padding: 0,
							minWidth: "auto",
							width: 18,
							height: 18,
							borderRadius: "50%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							zIndex: 2,
							boxShadow: "0 0 4px rgba(200, 0, 0, 0.5)",
						})}
						onClick={() => onRemove(row, col)}
					>
						×
					</Button>
				</>
			)}
		</Box>
	);
}
