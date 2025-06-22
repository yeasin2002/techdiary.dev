import HomeLeftSidebar from "@/app/(home)/_components/HomeLeftSidebar";
import HomeRightSidebar from "@/app/(home)/_components/HomeRightSidebar";
import SidebarToggleButton from "@/app/(home)/_components/SidebarToggleButton";
import HomepageLayout from "@/components/layout/HomepageLayout";
import TagArticleFeed from "./_components/TagArticleFeed";

interface TagPageProps {
  params: Promise<{
    tag_id: string;
  }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag_id } = await params;

  return (
    <HomepageLayout
      LeftSidebar={<HomeLeftSidebar />}
      RightSidebar={<HomeRightSidebar />}
      NavbarTrailing={<SidebarToggleButton />}
    >
      <div className="px-4 py-6">
        <TagArticleFeed tagId={tag_id} />
      </div>
    </HomepageLayout>
  );
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag_id } = await params;

  // For now, use tag_id in the title. Later we can fetch the tag name if needed
  return {
    title: `Tag ${tag_id} - Tech Diary`,
    description: `Browse all articles with this tag on Tech Diary`,
    openGraph: {
      title: `Tag ${tag_id} - Tech Diary`,
      description: `Browse all articles with this tag on Tech Diary`,
    },
  };
}