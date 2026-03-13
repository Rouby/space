import { createFileRoute } from "@tanstack/react-router";
import { LearnPage } from "../../features/LearnPage/LearnPage";

export const Route = createFileRoute("/_dashboard/learn")({
	component: LearnPage,
});
