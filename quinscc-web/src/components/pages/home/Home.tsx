import { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from '@mantine/carousel';
import type { EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import {
  SimpleGrid,
  Card,
  Group,
  Stack,
  Title,
  Text,
  Button,
  Image,
  ActionIcon,
  SegmentedControl,
} from '@mantine/core';
import {
  CaretLeftIcon,
  CaretRightIcon,
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PlayIcon,
} from '@phosphor-icons/react';
import logo from '../../../assets/hcclogo.png';
import homeKitImg from '../../../assets/2526 Home Kit.png';
import awayKitImg from '../../../assets/2526 Away Kit.png';
import loftusCheekImg from '../../../assets/Loftus-Cheek Squad Headshot.png';
import classes from './Home.module.css';

/* ---- Data ---- */

interface HeroSlide {
  category: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  image: string;
}

const heroSlides: HeroSlide[] = [
  {
    category: 'First Team',
    title: "Last-Gasp Win\nAt Craneford Way",
    subtitle: "Smith's 92nd-minute strike secures all three points in a thriller.",
    ctaText: 'Read Match Report',
    ctaUrl: '/news',
    image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  {
    category: 'Transfer News',
    title: "Harlequins Sign\nStar Midfielder",
    subtitle: "International midfielder joins the Quins on a three-year deal from Serie A.",
    ctaText: 'Full Story',
    ctaUrl: '/news',
    image: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  {
    category: 'Academy',
    title: "Youth Academy\nProduces Three Debuts",
    subtitle: "Record-breaking season sees three academy graduates make first-team appearances.",
    ctaText: 'Academy News',
    ctaUrl: '/news',
    image: 'https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  {
    category: 'Community',
    title: "Quins Foundation\nLaunches New Initiative",
    subtitle: "Club partners with local schools to bring football coaching to 5,000 children.",
    ctaText: 'Learn More',
    ctaUrl: '/news',
    image: 'https://images.pexels.com/photos/3041176/pexels-photo-3041176.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  {
    category: 'Match Preview',
    title: "Derby Day\nAwaits The Quins",
    subtitle: "Harlequins prepare for the biggest match of the season against local rivals.",
    ctaText: 'Match Preview',
    ctaUrl: '/news',
    image: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
];

interface VideoItem {
  id: string;
  category: string;
  title: string;
  date: string;
  duration: string;
  thumbnail: string;
}

const videoList: VideoItem[] = [
  {
    id: 'highlight1',
    category: 'Highlights',
    title: 'Harlequins FC 3-1 Maidstone United',
    date: '18 May 2026',
    duration: '02:45',
    thumbnail: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'interview1',
    category: 'Interview',
    title: 'Post-Match: Smith on The Home Win',
    date: '18 May 2026',
    duration: '01:32',
    thumbnail: 'https://images.pexels.com/photos/3764014/pexels-photo-3764014.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'bts1',
    category: 'Behind the Scenes',
    title: 'Inside Training: Eyes on the Playoffs',
    date: '16 May 2026',
    duration: '03:10',
    thumbnail: 'https://images.pexels.com/photos/3041176/pexels-photo-3041176.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

/* ---- Components ---- */

function Home() {
  const autoplay = useRef(Autoplay({ delay: 6000 }));
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeKit, setActiveKit] = useState<'home' | 'away'>('home');
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);
  const scrollTo = useCallback((index: number) => embla?.scrollTo(index), [embla]);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setActiveSlide(embla.selectedScrollSnap());
    embla.on('select', onSelect);
    return () => { embla.off('select', onSelect); };
  }, [embla]);

  const totalSlides = heroSlides.length;
  const currentNum = String(activeSlide + 1).padStart(2, '0');
  const totalNum = String(totalSlides).padStart(2, '0');

  return (
    <>
      {/* ===== HERO CAROUSEL ===== */}
      <section className={classes.heroSection}>
        <Carousel
          withControls={false}
          withIndicators={false}
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={() => autoplay.current.play()}
          getEmblaApi={setEmbla}
        >
          {heroSlides.map((slide, index) => (
            <Carousel.Slide key={index}>
              <div
                className={classes.heroSlide}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <Stack gap="sm" className={classes.heroContent}>
                  <Text
                    size="xs"
                    fw={700}
                    tt="uppercase"
                    lts="3px"
                    c="var(--hcc-accent)"
                  >
                    {slide.category}
                  </Text>
                  <Title order={1} className={classes.heroTitle}>
                    {slide.title.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < slide.title.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </Title>
                  <Text size="md" c="var(--hcc-gray-300)" lh={1.5} maw={450} mb="sm">
                    {slide.subtitle}
                  </Text>
                  <Button
                    component={Link}
                    to={slide.ctaUrl}
                    variant="outline"
                    color="pink"
                    radius="xl"
                    rightSection={<ArrowRightIcon size={14} weight="bold" />}
                    className={classes.heroCta}
                  >
                    {slide.ctaText}
                  </Button>
                </Stack>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>

        {/* Navigation Arrows */}
        <ActionIcon
          variant="default"
          size="xl"
          radius="xl"
          onClick={scrollPrev}
          aria-label="Previous slide"
          className={`${classes.heroArrow} ${classes.heroArrowLeft}`}
        >
          <CaretLeftIcon size={20} weight="bold" />
        </ActionIcon>
        <ActionIcon
          variant="default"
          size="xl"
          radius="xl"
          onClick={scrollNext}
          aria-label="Next slide"
          className={`${classes.heroArrow} ${classes.heroArrowRight}`}
        >
          <CaretRightIcon size={20} weight="bold" />
        </ActionIcon>

        {/* Pagination */}
        <Group gap="sm" className={classes.heroPagination}>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`${classes.heroDot} ${index === activeSlide ? classes.heroDotActive : ''}`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
          <Text size="sm" fw={600} c="var(--hcc-gray-300)" ml="xs" className={classes.heroPaginationText}>
            <Text component="span" c="white" size="md" fw={700}>{currentNum}</Text> / {totalNum}
          </Text>
        </Group>
      </section>

      {/* ===== 4-COLUMN CONTENT GRID ===== */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={1} className={classes.contentGrid}>
        {/* --- Next Fixture --- */}
        <Card className={classes.gridCard} padding="1.5rem" radius={0}>
          <Title order={3} className={classes.gridCardTitle}>Next Fixture</Title>
          <Stack gap="1.5rem" className={classes.fixtureCard}>
            <Group gap="1.5rem" justify="center" align="center">
              <Stack align="center" gap={8}>
                <Image src={logo} alt="Harlequins FC" w={56} h={56} radius="xl" fit="contain" className={classes.teamLogo} />
                <Text size="xs" fw={600} tt="uppercase" lts="1px" c="var(--hcc-gray-300)" ta="center" maw={90} className={classes.teamName}>
                  Harlequins FC
                </Text>
              </Stack>
              <Text fw={800} size="lg" c="var(--hcc-gray-400)" className={classes.vsText}>VS</Text>
              <Stack align="center" gap={8}>
                <div className={classes.teamLogoFallback}>MUFC</div>
                <Text size="xs" fw={600} tt="uppercase" lts="1px" c="var(--hcc-gray-300)" ta="center" maw={90} className={classes.teamName}>
                  Maidstone United
                </Text>
              </Stack>
            </Group>

            <Stack gap={6}>
              <Group gap={8} wrap="nowrap">
                <CalendarIcon size={14} className={classes.fixtureDetailIcon} />
                <Text size="sm" c="var(--hcc-gray-400)">24 May 2026</Text>
                <Text size="sm" c="var(--hcc-gray-500)" mx={4}>|</Text>
                <ClockIcon size={14} className={classes.fixtureDetailIcon} />
                <Text size="sm" c="var(--hcc-gray-400)">15:00</Text>
              </Group>
              <Group gap={8} wrap="nowrap">
                <MapPinIcon size={14} className={classes.fixtureDetailIcon} />
                <Text size="sm" c="var(--hcc-gray-400)">Craneford Way Stadium, Twickenham</Text>
              </Group>
            </Stack>

            <Button
              component={Link}
              to="/fixtures"
              variant="outline"
              color="pink"
              radius="xl"
              fullWidth
              rightSection={<ArrowRightIcon size={12} weight="bold" />}
              className={classes.gridCta}
            >
              View All Fixtures
            </Button>
          </Stack>
        </Card>

        {/* --- Latest Videos --- */}
        <Card className={classes.gridCard} padding="1.5rem" radius={0}>
          <Group justify="space-between" align="center" mb="1rem">
            <Title order={3} className={classes.gridCardTitle} style={{ marginBottom: 0 }}>
              Latest Videos
            </Title>
            <Text
              component={Link}
              to="/videos"
              size="xs"
              fw={600}
              tt="uppercase"
              lts="1.5px"
              c="var(--hcc-gray-400)"
              className={classes.viewAllLink}
            >
              View All <ArrowRightIcon size={10} weight="bold" />
            </Text>
          </Group>
          <Stack gap="sm">
            {videoList.map((video) => (
              <Group
                key={video.id}
                gap="sm"
                wrap="nowrap"
                className={classes.videoItem}
                onClick={() => window.open(`https://youtube.com/watch?v=${video.id}`, '_blank')}
              >
                <div className={classes.videoThumbnail}>
                  <Image src={video.thumbnail} alt={video.title} w={120} h={72} fit="cover" radius="xs" />
                  <div className={classes.videoPlayOverlay}>
                    <PlayIcon size={24} weight="fill" color="white" />
                  </div>
                  <Text size="xs" fw={600} className={classes.videoDuration}>{video.duration}</Text>
                </div>
                <Stack gap={4} justify="center" style={{ minWidth: 0 }}>
                  <Text size="xs" fw={700} tt="uppercase" lts="1.5px" c="var(--hcc-accent)" className={classes.videoCategory}>
                    {video.category}
                  </Text>
                  <Text size="sm" fw={600} c="white" lineClamp={2} lh={1.3} className={classes.videoTitle}>
                    {video.title}
                  </Text>
                  <Text size="xs" c="var(--hcc-gray-500)">{video.date}</Text>
                </Stack>
              </Group>
            ))}
          </Stack>
        </Card>

        {/* --- Men's Squad / Captain --- */}
        <Card className={classes.gridCard} padding="1.5rem" radius={0}>
          <Title order={3} className={classes.gridCardTitle}>Men's Squad</Title>
          <div className={classes.squadCard}>
            <div className={classes.squadContent}>
              <Image
                src={loftusCheekImg}
                alt="Ruben Loftus-Cheek"
                className={classes.squadImage}
              />
              <div className={classes.squadOverlay} />
              <Stack gap={4} className={classes.squadInfo}>
                <Text fw={700} size="lg" c="white" className={classes.squadName}>
                  Ruben Loftus-Cheek
                </Text>
                <Text size="xs" fw={600} tt="uppercase" lts="1px" c="var(--hcc-accent)" mb="xs">
                  Captain
                </Text>
                <Button
                  component={Link}
                  to="/squad"
                  variant="outline"
                  color="pink"
                  radius="xl"
                  fullWidth
                  rightSection={<ArrowRightIcon size={12} weight="bold" />}
                  className={classes.gridCta}
                >
                  View Full Squad
                </Button>
              </Stack>
            </div>
          </div>
        </Card>

        {/* --- 2025/26 Kits --- */}
        <Card className={classes.gridCard} padding="1.5rem" radius={0}>
          <Group justify="space-between" align="center" mb="0.8rem">
            <Title order={3} className={classes.gridCardTitle} style={{ marginBottom: 0 }}>
              2025/26 Kits
            </Title>
            <SegmentedControl
              size="xs"
              value={activeKit}
              onChange={(val) => setActiveKit(val as 'home' | 'away')}
              data={[
                { label: 'Home', value: 'home' },
                { label: 'Away', value: 'away' },
              ]}
              color="pink"
              className={classes.kitSegmented}
            />
          </Group>

          <Stack align="center" gap="md" h="100%">
            <div className={classes.kitImageWrapper}>
              <Image
                src={activeKit === 'home' ? homeKitImg : awayKitImg}
                alt={activeKit === 'home' ? '2025/26 Home Kit' : '2025/26 Away Kit'}
                className={classes.kitImage}
                radius="md"
              />
            </div>
            <div style={{ marginTop: 'auto', width: '100%' }}>
              <Button
                component={Link}
                to="/shop"
                variant="outline"
                color="pink"
                radius="xl"
                fullWidth
                rightSection={<ArrowRightIcon size={12} weight="bold" />}
                className={classes.gridCta}
              >
                Shop {activeKit === 'home' ? 'Home' : 'Away'} Kit
              </Button>
            </div>
          </Stack>
        </Card>
      </SimpleGrid>
    </>
  );
}

export default Home;