import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { ArrowRightCircle } from 'lucide-react';

export default function Home() {
	return (
		<section className="fill-body flex flex-row items-center gradient-bg px-8 py-8 md:py-10">
			<div className="flex flex-col justify-center">
				<p className={`${title()} mb-4`}>Minutes</p>
				<p className={`${subtitle()}`}>A simple note taking app to enhance education. <br/>
				Made for Students, by Students</p>
				<Button radius="full" as={Link} href="/login" className="mt-4 w-fit bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">
				Learn the Difference <ArrowRightCircle />
				</Button>
			</div>
			<div className="flex flex-col items-center justify-center">
				<img src="/robot.png" className="w-96 h-96" />
			</div>
			{/* <div className="inline-block max-w-lg text-center justify-center">
				<h1 className={title()}>Make&nbsp;</h1>
				<h1 className={title({ color: "violet" })}>beautiful&nbsp;</h1>
				<br />
				<h1 className={title()}>
					websites regardless of your design experience.
				</h1>
				<h2 className={subtitle({ class: "mt-4" })}>
					Beautiful, fast and modern React UI library.
				</h2>
			</div>

			<div className="flex gap-3">
				<Link
					isExternal
					href={siteConfig.links.docs}
					className={buttonStyles({ color: "primary", radius: "full", variant: "shadow" })}
				>
					Documentation
				</Link>
				<Link
					isExternal
					className={buttonStyles({ variant: "bordered", radius: "full" })}
					href={siteConfig.links.github}
				>
					<GithubIcon size={20} />
					GitHub
				</Link>
			</div>

			<div className="mt-8">
				<Snippet hideSymbol hideCopyButton variant="flat">
					<span>
						Get started by editing <Code color="primary">app/page.tsx</Code>
					</span>
				</Snippet>
			</div> */}
		</section>
	);
}
