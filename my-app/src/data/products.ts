export interface Product {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  rating: number;
  badge?: string;
}

export const initialProducts: Product[] = [
  {
    id: '1',
    title: "Bloom Creative Моногидрат без вкуса, порошок",
    price: 19.99,
    image: "https://res.cloudinary.com/dqr68rvid/image/upload/v1714041600/product1.png",
    category: "Витамины",
    rating: 4.6,
  },
  {
    id: '2',
    title: "Aquaphor Восстанавливающие маски для рук",
    price: 7.99,
    image: "https://res.cloudinary.com/dqr68rvid/image/upload/v1714041600/product2.png",
    category: "Уход за телом",
    rating: 4.5,
    badge: "Новинка",
  },
  {
    id: '3',
    title: "Aquaphor Восстанавливающие маски для ног",
    price: 7.99,
    image: "https://res.cloudinary.com/dqr68rvid/image/upload/v1714041600/product3.png",
    category: "Уход за телом",
    rating: 4.5,
    badge: "Новинка",
  },
  {
    id: '4',
    title: "Dior Sauvage Дезодорант-стик",
    price: 38.00,
    image: "https://res.cloudinary.com/dqr68rvid/image/upload/v1714041600/product4.png",
    category: "Дезодоранты",
    rating: 4.4,
  },
  {
    id: '5',
    title: "Clinique Очищающий гель для умывания (для мужчин)",
    price: 28.00,
    image: "https://res.cloudinary.com/dqr68rvid/image/upload/v1714041600/product5.png",
    category: "Умывание",
    rating: 4.6,
    badge: "Хит продаж",
  },
  {
    id: '6',
    title: "NEST New York Классическая свеча Дикая мята и Эвкалипт",
    price: 48.00,
    image: "https://res.cloudinary.com/dqr68rvid/image/upload/v1714041600/product6.png",
    category: "Ароматы для дома",
    rating: 5.0,
  },
  {
    id: '7',
    title: "Bloom Карандаш для губ с эффектом объема",
    price: 22.00,
    image: "https://res.cloudinary.com/dqr68rvid/image/upload/v1714041600/product7.png",
    category: "Губы",
    rating: 4.2,
  },
  {
    id: '8',
    title: "IT Cosmetics Superhero Объемная водостойкая тушь",
    price: 28.00,
    image: "https://res.cloudinary.com/dqr68rvid/image/upload/v1714041600/product8.png",
    category: "Тушь",
    rating: 4.2,
  },
];
