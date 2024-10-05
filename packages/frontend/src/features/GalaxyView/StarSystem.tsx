import type { MotionValue } from "framer-motion";
import { useEffect, useState, useTransition } from "react";
import { Fragment } from "react/jsx-runtime";

export function StarSystem({
	zoom,
	onPointerDown,
}: {
	zoom: MotionValue<number>;
	onPointerDown: (event: React.PointerEvent) => void;
}) {
	const planets = [
		{
			id: 1,
			orbit: 11,
			color: "blue",
			size: 2,
			rotationOffset: 54,
			rotationSpeed: 7,
		},
		{
			id: 2,
			orbit: 16,
			color: "green",
			size: 3,
			rotationOffset: 151,
			rotationSpeed: 5,
		},
		{
			id: 3,
			orbit: 21.5,
			color: "red",
			size: 2.5,
			rotationOffset: 277,
			rotationSpeed: 10,
		},
	];

	const [minified, setMinified] = useState(() => zoom.get() < 2);
	const [, startTransition] = useTransition();

	useEffect(() => {
		return zoom.on("change", (v) => {
			startTransition(() => {
				setMinified(v < 2);
			});
		});
	}, [zoom]);

	return (
		<g onPointerDown={onPointerDown}>
			<circle
				r="70"
				filter={minified ? undefined : "url(#noise)"}
				fill="orange"
				transform="scale(0.1)"
			/>
			{!minified &&
				planets.map((planet) => {
					const dashSize = (planet.orbit * Math.PI * 2) / 36;
					return (
						<Fragment key={planet.id}>
							<circle
								r={planet.orbit}
								fill="none"
								stroke="rgba(255,255,255,0.6)"
								strokeWidth={0.5}
								strokeDasharray={`${dashSize * 0.6} ${dashSize * 0.4}`}
								strokeLinecap="butt"
							/>
							<g>
								<circle r={planet.size} cx={planet.orbit} fill={planet.color} />
								<animateTransform
									attributeName="transform"
									type="rotate"
									from={planet.rotationOffset}
									to={planet.rotationOffset + 360}
									dur={`${planet.rotationSpeed}s`}
									repeatCount="indefinite"
								/>
							</g>
						</Fragment>
					);
				})}
			<filter id="noise">
				<feTurbulence id="color-noise" baseFrequency="0.1" />
				<feGaussianBlur stdDeviation="3" />
				<feColorMatrix
					values="0 0 0 1 1
                  0 0 0 1 .1
                  0 0 0 0 0
                  0 0 0 0 1"
					result="base"
				/>
				<feTurbulence id="wave-noise" baseFrequency="0.1" result="ripples" />
				<feDisplacementMap
					in="base"
					in2="ripples"
					scale="30"
					result="texture"
				/>
				<animate
					xlinkHref="#wave-noise"
					attributeName="baseFrequency"
					dur="10s"
					keyTimes="0;0.5;1"
					values="0.1 0.06;0.06 0.1;0.1 0.06"
					repeatCount="indefinite"
				/>
				<animate
					xlinkHref="#color-noise"
					attributeName="baseFrequency"
					dur="10s"
					keyTimes="0;0.5;1"
					values="0.08 0.1;0.1 0.08;0.08 0.1"
					repeatCount="indefinite"
				/>
				<feImage
					id="filter-image"
					result="barrel"
					x="0"
					y="0"
					width="100%"
					height="100%"
				/>
				<feDisplacementMap
					in2="barrel"
					in="texture"
					xChannelSelector="R"
					yChannelSelector="G"
					scale="256"
					result="final"
				/>
				<feComposite operator="in" in="final" in2="SourceGraphic" />
			</filter>
		</g>
	);
}
