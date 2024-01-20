export default function RegisterLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col items-center justify-center h-full gradient-bg gap-4 py-8 pb-24 md:py-10">
			<div className="inline-block text-center justify-center w-full">
				{children}
			</div>
		</section>
	);
}
