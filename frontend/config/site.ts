export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Minutes",
	description: "Making education easy",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
    {
      label: "Editor",
      href: "/editor",
    },
	],
	navMenuItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "Editor",
			href: "/editor",
		},
		{
			label: "Logout",
			href: "/logout",
		},
	],
	links: {
		github: "https://github.com/mynamegabe/Minutes",
		twitter: "https://twitter.com/getnextui",
		discord: 'https://discord.com', // put this for the time being
		docs: "https://nextui.org",
	},
};
