<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { leaderboardData } from '../../stores/leaderboard';

	import Keystroke from 'svelte-keystroke';
	// *** Game Setup! ***
	let letters;
	let score = 0;
	let vowelsDisabled = true;
	let consonantsDisabled = false;
	let guessesCount = 0;
	let tmpCD;
	let tmpVD;
	let leaderboardEntries;
	let reward = '';
	let isLangChoosen = false;
	let isSidebarHidden = 'hidden';
	let clickedButtons = [];
	let isLetterChosen = true;

	function compare(a, b) {
		if (a.score > b.score) {
			return -1;
		}
		if (a.score < b.score) {
			return 1;
		}
		return 0;
	}

	leaderboardEntries = get(leaderboardData).sort(compare).slice(0, 10);

	onMount(() => {
		letters.innerHTML = answerArray.join(' ');
		initDrawingCanvas();
		initPhysics();
		requestAnimationFrame(loop);
	});

	// these are our words
	let quizData = [{ name: 'Kaguya sama wa Kokurasetai', category: 'anime' }];

	const chooseLang = async (lang) => {
		lang = lang;
		isLangChoosen = true;
		isSidebarHidden = 'shown';
		if (lang === 'JP') {
			quizData = [
				{ name: 'Kaguya sama wa Kokurasetai', category: 'anime' },
				{ name: 'Hagane no Renkinjutsushi', category: 'anime' },
				{ name: 'Steins Gate', category: 'anime' },
				{ name: 'Clannad', category: 'anime' },
				{ name: 'kimi no na wa', category: 'anime' },
				{ name: 'Code Geass', category: 'anime' },
				{ name: 'Sen to Chihiro no Kamikakushi', category: 'anime' },
				{ name: 'Mononoke Hime', category: 'anime' },
				{ name: 'Suzumiya Haruhi no Shoushitsu', category: 'anime' },
				{ name: 'Death Note', category: 'anime' },
				{ name: 'Koe no Katachi', category: 'anime' },
				{ name: 'Shingeki no Kyojin', category: 'anime' },
				{ name: 'Gintama', category: 'anime' },
				{ name: 'HUNTER x HUNTER', category: 'anime' },
				{ name: 'Fruits Basket', category: 'anime' },
				{ name: 'Sangatsu no Lion', category: 'anime' },
				{ name: 'Koe no Katachi', category: 'anime' },
				{ name: 'Violet Evergarden', category: 'anime' },
				{ name: 'Kimetsu no Yaiba', category: 'anime' },
				{ name: 'Spy x Family', category: 'anime' },
				{ name: 'Mob Psycho', category: 'anime' },
				{ name: 'Link Click', category: 'anime' },
				{ name: 'Made in Abyss', category: 'anime' },
				{ name: 'Neon Genesis Evangelion', category: 'anime' },
				{ name: 'Odd Taxi', category: 'anime' },
				{ name: 'Mushoku Tensei', category: 'anime' },
				{ name: 'Vinland Saga', category: 'anime' },
				{ name: 'Jujutsu Kaisen', category: 'anime' },
				{ name: 'Shigatsu wa Kimi no Uso', category: 'anime' },
				{ name: 'One Piece', category: 'anime' },
				{ name: 'Natsume Yuujinchou', category: 'anime' },
				{ name: 'Tengen Toppa Gurren Lagann', category: 'anime' },
				{ name: 'Ousama Ranking', category: 'anime' },
				{ name: 'Shoujo Kageki Revue Starlight', category: 'anime' },
				{ name: 'Kimi no Suizou wo Tabetai', category: 'anime' },
				{ name: 'Yakusoku no Neverland', category: 'anime' },
				{ name: 'Haikyuu', category: 'anime' },
				{ name: 'Kara no Kyoukai', category: 'anime' },
				{ name: 'Perfect Blue', category: 'anime' },
				{ name: 'Yuru Camp', category: 'anime' },
				{ name: 'Ghost in the Shell', category: 'anime' },
				{ name: 'One Punch Man', category: 'anime' },
				{ name: 'Samurai Champloo', category: 'anime' },
				{ name: 'Banana Fish', category: 'anime' },
				{ name: 'JoJo no Kimyou na Bouken', category: 'anime' },
				{ name: 'Karaki Jozou no Takagi san', category: 'anime' },
				{ name: 'Mahou Shoujo Madoka Magica', category: 'anime' },
				{ name: 'Nichijou', category: 'anime' },
				{ name: 'Saiki Kusuo no Psi Nan', category: 'anime' },
				{ name: 'Vivy Fluorite Eyes Song', category: 'anime' },
				{ name: 'Grand Blue', category: 'anime' },
				{ name: 'Summer Time Render', category: 'anime' },
				{ name: 'Houseki no Kuni', category: 'anime' },
				{ name: 'Non Non Biyori', category: 'anime' },
				{ name: 'Tensei shitara Slime Datta Ken', category: 'anime' },
				{ name: 'Barakamon', category: 'anime' },
				{ name: 'Baccano', category: 'anime' },
				{ name: 'Fumetsu no Anata e', category: 'anime' },
				{ name: 'Kamisama Hajimemashita', category: 'anime' },
				{ name: 'Usagi Drop', category: 'anime' },
				{ name: 'HELLSING', category: 'anime' },
				{ name: 'Initial D', category: 'anime' },
				{ name: 'Kobayashi san Chi no Maid Dragon', category: 'anime' },
				{ name: 'Kiseijuu', category: 'anime' },
				{ name: 'Psycho Pass', category: 'anime' },
				{ name: 'Bakemonogatari', category: 'anime' },
				{ name: 'Sono Bisque Doll wa Koi wo Suru', category: 'anime' },
				{ name: 'Boku dake ga Inai Machi', category: 'anime' },
				{ name: 'Shinsekai yori', category: 'anime' },
				{ name: 'Dr Stone', category: 'anime' },
				{ name: 'Fate Zero', category: 'anime' },
				{ name: 'Paripi Koumei', category: 'anime' },
				{ name: 'Trigun', category: 'anime' },
				{ name: 'Ookami to Koushinryou', category: 'anime' },
				{ name: 'Horimiya', category: 'anime' },
				{ name: 'Tokyo Revengers', category: 'anime' },
				{ name: 'No Game No Life', category: 'anime' },
				{ name: 'Hyouka', category: 'anime' },
				{ name: 'Angel Beats', category: 'anime' },
				{ name: 'Dorohedoro', category: 'anime' },
				{ name: 'Black Lagoon', category: 'anime' },
				{ name: 'Yofukashi no Uta', category: 'anime' },
				{ name: 'Kaichou wa Maid sama', category: 'anime' },
				{ name: 'Kakushigoto ', category: 'anime' },
				{ name: 'ReLIFE', category: 'anime' },
				{ name: 'Naruto', category: 'anime' },
				{ name: 'Promare', category: 'anime' },
				{ name: 'Youjo Senki', category: 'anime' },
				{ name: 'Mawaru Penguindrum', category: 'anime' },
				{ name: 'Noragami', category: 'anime' },
				{ name: 'Dragon Ball', category: 'anime' },
				{ name: 'Log Horizon', category: 'anime' },
				{ name: 'Boku no Hero Academia', category: 'anime' },
				{ name: 'Overlord', category: 'anime' },
				{ name: 'Tonikaku Kawaii', category: 'anime' },
				{ name: 'Drifters', category: 'anime' },
				{ name: 'Megalo Box', category: 'anime' },
				{ name: 'Shadows House', category: 'anime' },
				{ name: 'Golden Kamuy', category: 'anime' },
				{ name: 'Blue Period', category: 'anime' },
				{ name: 'Jibaku Shounen Hanako kun', category: 'anime' },
				{ name: 'Soul Eater', category: 'anime' },
				{ name: 'Tasogare Otome x Amnesia', category: 'anime' },
				{ name: 'Little Witch Academia', category: 'anime' },
				{ name: 'Kekkai Sensen', category: 'anime' },
				{ name: 'Last Exile', category: 'anime' },
				{ name: 'Tokyo Ghoul', category: 'anime' },
				{ name: 'Hataraku Maou sama', category: 'anime' },
				{ name: 'Kageki Shoujo', category: 'anime' },
				{ name: 'Kokoro Connect', category: 'anime' },
				{ name: 'Shaman King', category: 'anime' },
				{ name: 'Doraemon', category: 'anime' },
				{ name: 'Charlotte', category: 'anime' },
				{ name: 'Claymore', category: 'anime' },
				{ name: 'Golden Time', category: 'anime' },
				{ name: 'Jinrui wa Suitai Shimashita', category: 'anime' },
				{ name: 'Saint Seiya', category: 'anime' },
				{ name: 'Toki wo Kakeru Shoujo', category: 'anime' },
				{ name: 'Given', category: 'anime' },
				{ name: 'Anohana', category: 'anime' },
				{ name: 'NHK ni Youkoso', category: 'anime' },
				{ name: 'Tenki no Ko', category: 'anime' },
				{ name: 'Hotarubi no Mori e', category: 'anime' },
				{ name: 'Kino no Tabi', category: 'anime' },
				{ name: 'Tonari no Totoro', category: 'anime' },
				{ name: 'Great Pretender', category: 'anime' },
				{ name: 'Dororo', category: 'anime' },
				{ name: 'Danshi Koukousei no Nichijou', category: 'anime' },
				{ name: 'Kidou Senshi Gundam', category: 'anime' },
				{ name: 'Bungou Stray Dogs', category: 'anime' },
				{ name: 'Doraemon', category: 'anime' },
				{ name: 'Pokemon', category: 'anime' },
				{ name: 'Vanitas no Carte', category: 'anime' },
				{ name: 'One Piece', category: 'anime' },
				{ name: 'Asobi Asobase', category: 'anime' },
				{ name: 'Girls und Panzer', category: 'anime' },
				{ name: 'Higurashi no Naku Koro ni', category: 'anime' },
				{ name: 'Senki Zesshou Symphogear', category: 'anime' },
				{ name: 'Toaru Kagaku no Railgun', category: 'anime' },
				{ name: 'Shokugeki no Souma', category: 'anime' },
				{ name: 'Death Parade', category: 'anime' },
				{ name: 'Hinamatsuri', category: 'anime' },
				{ name: 'Komi san wa Comyushou desu', category: 'anime' },
				{ name: 'Love Live School Idol Project', category: 'anime' },
				{ name: 'Dragon Ball', category: 'anime' },
				{ name: 'Bleach', category: 'anime' },
				{ name: 'Naruto', category: 'anime' },
				{ name: 'Mahou Shoujo Lyrical Nanoha', category: 'anime' },
				{ name: 'Gotobun no Hanayome', category: 'anime' },
				{ name: 'Black Clover', category: 'anime' },
				{ name: 'Chuunibyou demo Koi ga Shitai', category: 'anime' },
				{ name: 'Meitantei Conan', category: 'anime' },
				{ name: 'Durarara', category: 'anime' },
				{ name: 'Sakurasou no Pet na Kanojo', category: 'anime' },
				{ name: 'Toradora', category: 'anime' },
				{ name: 'Zankyou no Terror', category: 'anime' },
				{ name: 'Kanata no Astra', category: 'anime' },
				{ name: 'Lycoris Recoil', category: 'anime' },
				{ name: 'Hidamari Sketch', category: 'anime' },
				{ name: 'Kuroko no Basket', category: 'anime' },
				{ name: 'Black Bullet', category: 'anime' },
				{ name: 'Mahoutsukai no Yome', category: 'anime' },
				{ name: 'Serial Experiments Lain', category: 'anime' },
				{ name: 'Majo no Tabitabi', category: 'anime' },
				{ name: 'ID INVADED', category: 'anime' },
				{ name: 'Penguin Highway', category: 'anime' },
				{ name: 'Carole and Tuesday', category: 'anime' },
				{ name: 'Fugou Keiji Balance UNLIMITED', category: 'anime' },
				{ name: 'Ishuzoku Reviewers', category: 'anime' },
				{ name: 'Kami no Tou', category: 'anime' },
				{ name: 'Kanojo mo Kanojo', category: 'anime' },
				{ name: 'Munou na Nana', category: 'anime' },
				{ name: 'Somali to Mori no Kamisama', category: 'anime' },
				{ name: 'Teekyuu', category: 'anime' },
				{ name: 'Brand New Animal', category: 'anime' },
				{ name: 'Happy Sugar Life', category: 'anime' },
				{ name: 'Shinmai Maou no Testament', category: 'anime' },
				{ name: 'High School DxD', category: 'anime' },
				{ name: 'Imouto sae Ireba Ii', category: 'anime' },
				{ name: 'Goblin Slayer', category: 'anime' },
				{ name: 'Nekopara', category: 'anime' },
				{ name: 'Princess Connect Re Dive', category: 'anime' },
				{ name: 'Robotics Notes', category: 'anime' },
				{ name: 'Sewayaki Kitsune no Senko san', category: 'anime' },
				{ name: 'Another', category: 'anime' },
				{ name: 'Wonder Egg Priority', category: 'anime' },
				{ name: 'Domestic na Kanojo', category: 'anime' },
				{ name: 'Tomodachi Game', category: 'anime' },
				{ name: 'Elfen Lied', category: 'anime' },
				{ name: 'Darling in the Franxx', category: 'anime' },
				{ name: 'Date a Live', category: 'anime' },
				{ name: 'Engage Kiss', category: 'anime' },
				{ name: 'Tate no Yuusha no Nariagari', category: 'anime' },
				{ name: 'Machikado Mazoku', category: 'anime' }
			];
		} else {
			quizData = [
				{ name: 'Kaguya-sama: Love is War', category: 'anime' },
				{ name: 'Fullmetal Alchemist Brotherhood', category: 'anime' },
				{ name: 'Steins Gate', category: 'anime' },
				{ name: 'Clannad', category: 'anime' },
				{ name: 'Your Name', category: 'anime' },
				{ name: 'Code Geass', category: 'anime' },
				{ name: 'Spirited Away', category: 'anime' },
				{ name: 'Princess Mononoke', category: 'anime' },
				{ name: 'Disappearance of Haruhi Suzumiya', category: 'anime' },
				{ name: 'Death Note', category: 'anime' },
				{ name: 'A Silent Voice', category: 'anime' },
				{ name: 'Attack on Titan', category: 'anime' },
				{ name: 'Gintama', category: 'anime' },
				{ name: 'Hunter x Hunter', category: 'anime' },
				{ name: 'Fruits Basket', category: 'anime' },
				{ name: 'March comes in like a lion', category: 'anime' },
				{ name: 'A Silent Voice', category: 'anime' },
				{ name: 'Violet Evergarden', category: 'anime' },
				{ name: 'Demon Slayer', category: 'anime' },
				{ name: 'Spy x Family', category: 'anime' },
				{ name: 'Mob Psycho', category: 'anime' },
				{ name: 'Link Click', category: 'anime' },
				{ name: 'Made in Abyss', category: 'anime' },
				{ name: 'Neon Genesis Evangelion', category: 'anime' },
				{ name: 'Odd Taxi', category: 'anime' },
				{ name: 'Jobless Reincarnation', category: 'anime' },
				{ name: 'Vinland Saga', category: 'anime' },
				{ name: 'Jujutsu Kaisen', category: 'anime' },
				{ name: 'Your lie in April', category: 'anime' },
				{ name: 'One Piece', category: 'anime' },
				{ name: 'Natsumes Book of friends', category: 'anime' },
				{ name: 'Gurren Lagann', category: 'anime' },
				{ name: 'Ranking of Kings', category: 'anime' },
				{ name: 'Revue Starlight', category: 'anime' },
				{ name: 'I Want to Eat Your Pancreas', category: 'anime' },
				{ name: 'The Promised Neverland', category: 'anime' },
				{ name: 'Haikyuu', category: 'anime' },
				{ name: 'the Garden of sinners', category: 'anime' },
				{ name: 'Perfect Blue', category: 'anime' },
				{ name: 'Laid Back Camp', category: 'anime' },
				{ name: 'Ghost in the Shell', category: 'anime' },
				{ name: 'One Punch Man', category: 'anime' },
				{ name: 'Samurai Champloo', category: 'anime' },
				{ name: 'Banana Fish', category: 'anime' },
				{ name: 'JoJos Bizarre Adventure', category: 'anime' },
				{ name: 'Karaki Jozou no Takagi-san', category: 'anime' },
				{ name: 'Puella Magi Madoka Magica', category: 'anime' },
				{ name: 'Nichijou', category: 'anime' },
				{ name: 'Saiki Kusuo no Psi Nan', category: 'anime' },
				{ name: 'Vivy Fluorite Eyes Song', category: 'anime' },
				{ name: 'Grand Blue', category: 'anime' },
				{ name: 'Summertime Render', category: 'anime' },
				{ name: 'Land of the Lustrous', category: 'anime' },
				{ name: 'Non Non Biyori', category: 'anime' },
				{ name: 'That Time I Got Reincarnated as a Slime', category: 'anime' },
				{ name: 'Barakamon', category: 'anime' },
				{ name: 'Baccano', category: 'anime' },
				{ name: 'To Your Eternity', category: 'anime' },
				{ name: 'Kamisama Kiss', category: 'anime' },
				{ name: 'Bunny Drop', category: 'anime' },
				{ name: 'Hellsing', category: 'anime' },
				{ name: 'Initial D', category: 'anime' },
				{ name: 'Miss Kobayashis Dragon Maid', category: 'anime' },
				{ name: 'Parasyte', category: 'anime' },
				{ name: 'Psycho-Pass', category: 'anime' },
				{ name: 'Bakemonogatari', category: 'anime' },
				{ name: 'My Dress Up Darling', category: 'anime' },
				{ name: 'ERASED', category: 'anime' },
				{ name: 'Shinsekai yori', category: 'anime' },
				{ name: 'Dr Stone', category: 'anime' },
				{ name: 'Fate Zero', category: 'anime' },
				{ name: 'Ya Boy Kongming', category: 'anime' },
				{ name: 'Trigun', category: 'anime' },
				{ name: 'Spice and Wolf', category: 'anime' },
				{ name: 'Horimiya', category: 'anime' },
				{ name: 'Tokyo Revengers', category: 'anime' },
				{ name: 'No Game No Life', category: 'anime' },
				{ name: 'Hyouka', category: 'anime' },
				{ name: 'Angel Beats', category: 'anime' },
				{ name: 'Dorohedoro', category: 'anime' },
				{ name: 'Black Lagoon', category: 'anime' },
				{ name: 'Call of the night', category: 'anime' },
				{ name: 'Maid sama', category: 'anime' },
				{ name: 'Kakushigoto ', category: 'anime' },
				{ name: 'ReLIFE', category: 'anime' },
				{ name: 'Naruto', category: 'anime' },
				{ name: 'Promare', category: 'anime' },
				{ name: 'Saga of Tanya the Evil', category: 'anime' },
				{ name: 'Penguindrum', category: 'anime' },
				{ name: 'Noragami', category: 'anime' },
				{ name: 'Dragon Ball', category: 'anime' },
				{ name: 'Log Horizon', category: 'anime' },
				{ name: 'My Hero Academia', category: 'anime' },
				{ name: 'Overlord', category: 'anime' },
				{ name: 'TONIKAWA Over The Moon For You', category: 'anime' },
				{ name: 'Drifters', category: 'anime' },
				{ name: 'Megalo Box', category: 'anime' },
				{ name: 'Shadows House', category: 'anime' },
				{ name: 'Golden Kamuy', category: 'anime' },
				{ name: 'Blue Period', category: 'anime' },
				{ name: 'Toilet bound Hanako Kun', category: 'anime' },
				{ name: 'Soul Eater', category: 'anime' },
				{ name: 'Dusk Maiden of Amnesia', category: 'anime' },
				{ name: 'Little Witch Academia', category: 'anime' },
				{ name: 'Blood Blockade Battlefront', category: 'anime' },
				{ name: 'Last Exile', category: 'anime' },
				{ name: 'Tokyo Ghoul', category: 'anime' },
				{ name: 'The Eden of Grisaia', category: 'anime' },
				{ name: 'The Devil is a Part Timer', category: 'anime' },
				{ name: 'Kageki Shoujo', category: 'anime' },
				{ name: 'Kokoro Connect', category: 'anime' },
				{ name: 'Shaman King', category: 'anime' },
				{ name: 'Doraemon', category: 'anime' },
				{ name: 'Charlotte', category: 'anime' },
				{ name: 'Claymore', category: 'anime' },
				{ name: 'Golden Time', category: 'anime' },
				{ name: 'Humanity Has Declined', category: 'anime' },
				{ name: 'Saint Seiya', category: 'anime' },
				{ name: 'The Girl Who Leapt Through Time', category: 'anime' },
				{ name: 'Given', category: 'anime' },
				{ name: 'Anohana', category: 'anime' },
				{ name: 'Welcome to the NHK', category: 'anime' },
				{ name: 'Weathering With You', category: 'anime' },
				{ name: 'Into the Forest of Fireflies Light', category: 'anime' },
				{ name: 'Kinos Journey', category: 'anime' },
				{ name: 'My Neighbor Totoro', category: 'anime' },
				{ name: 'Great Pretender', category: 'anime' },
				{ name: 'Dororo', category: 'anime' },
				{ name: 'Daily Lives of High School Boys', category: 'anime' },
				{ name: 'Mobile Suit Gundam', category: 'anime' },
				{ name: 'Bungou Stray Dogs', category: 'anime' },
				{ name: 'Doraemon', category: 'anime' },
				{ name: 'Pokemon', category: 'anime' },
				{ name: 'The Case Study of Vanitas', category: 'anime' },
				{ name: 'One Piece', category: 'anime' },
				{ name: 'Asobi Asobase', category: 'anime' },
				{ name: 'Girls und Panzer', category: 'anime' },
				{ name: 'When They Cry', category: 'anime' },
				{ name: 'Symphogear', category: 'anime' },
				{ name: 'A Certain Scientific Railgun', category: 'anime' },
				{ name: 'Food Wars', category: 'anime' },
				{ name: 'Death Parade', category: 'anime' },
				{ name: 'Hinamatsuri', category: 'anime' },
				{ name: 'Komi Cant Communicate', category: 'anime' },
				{ name: 'Love Live School Idol Project', category: 'anime' },
				{ name: 'Dragon Ball', category: 'anime' },
				{ name: 'Bleach', category: 'anime' },
				{ name: 'Naruto', category: 'anime' },
				{ name: 'Magical Girl Lyrical Nanoha', category: 'anime' },
				{ name: 'The Quintessential Quintuplets', category: 'anime' },
				{ name: 'Black Clover', category: 'anime' },
				{ name: 'Love, Chunibyo and Other Delusions', category: 'anime' },
				{ name: 'Detective Conan', category: 'anime' },
				{ name: 'Durarara', category: 'anime' },
				{ name: 'The Pet Girl of Sakurasou', category: 'anime' },
				{ name: 'Toradora', category: 'anime' },
				{ name: 'Terror in Resonance', category: 'anime' },
				{ name: 'ASTRA LOST IN SPACE', category: 'anime' },
				{ name: 'Lycoris Recoil', category: 'anime' },
				{ name: 'Hidamari Sketch', category: 'anime' },
				{ name: 'Kurokos Basketball', category: 'anime' },
				{ name: 'Black Bullet', category: 'anime' },
				{ name: 'The Ancient Magus Bride', category: 'anime' },
				{ name: 'Serial Experiments Lain', category: 'anime' },
				{ name: 'Wandering Witch The Journey of Elaina', category: 'anime' },
				{ name: 'ID INVADED', category: 'anime' },
				{ name: 'Penguin Highway', category: 'anime' },
				{ name: 'Carole and Tuesday', category: 'anime' },
				{ name: 'The Millionaire Detective  Balance UNLIMITED', category: 'anime' },
				{ name: 'Interspecies Reviewers', category: 'anime' },
				{ name: 'Tower of God', category: 'anime' },
				{ name: 'Girlfriend Girlfriend', category: 'anime' },
				{ name: 'Talentless Nana', category: 'anime' },
				{ name: 'Somali and the Forest Spirit', category: 'anime' },
				{ name: 'Teekyuu', category: 'anime' },
				{ name: 'Brand New Animal', category: 'anime' },
				{ name: 'Happy Sugar Life', category: 'anime' },
				{ name: 'The Testament of Sister New Devil', category: 'anime' },
				{ name: 'High School DxD', category: 'anime' },
				{ name: 'A Sisters All You Need', category: 'anime' },
				{ name: 'Goblin Slayer', category: 'anime' },
				{ name: 'Nekopara', category: 'anime' },
				{ name: 'Princess Connect Re Dive', category: 'anime' },
				{ name: 'Robotics Notes', category: 'anime' },
				{ name: 'The Helpful Fox Senko san', category: 'anime' },
				{ name: 'Another', category: 'anime' },
				{ name: 'Wonder Egg Priority', category: 'anime' },
				{ name: 'Domestic Girlfriend', category: 'anime' },
				{ name: 'Tomodachi Game', category: 'anime' },
				{ name: 'Elfen Lied', category: 'anime' },
				{ name: 'Darling in the Franxx', category: 'anime' },
				{ name: 'Date a Live', category: 'anime' },
				{ name: 'Engage Kiss', category: 'anime' },
				{ name: 'The Rising of the Shield Hero', category: 'anime' },
				{ name: 'The Demon Girl Next Door', category: 'anime' }
			];
		}
		// picks a word at random
		random = Math.floor(Math.random() * quizData.length);
		word = quizData[random].name.toUpperCase();

		// give me a list of empty letters for the word
		answerArray = [];
		remainingLettersCorrection = 0;
		word = word.split('');
		for (let i = 0; i < word.length; i++) {
			if (word[i] === ' ') {
				answerArray[i] = ' ';
				word[i] = ' ';
				remainingLettersCorrection++;
			} else {
				answerArray[i] = '_';
			}
		}
		// how many letters are left?
		remainingLetters = word.length - remainingLettersCorrection;
		letters.innerHTML = answerArray.join(' ');
		let wordWithoutVowels = word;
		wordWithoutVowels = wordWithoutVowels.filter(
			(letter) =>
				letter === 'B' ||
				letter === 'C' ||
				letter === 'D' ||
				letter === 'F' ||
				letter === 'G' ||
				letter === 'H' ||
				letter === 'J' ||
				letter === 'K' ||
				letter === 'L' ||
				letter === 'M' ||
				letter === 'N' ||
				letter === 'O' ||
				letter === 'P' ||
				letter === 'Q' ||
				letter === 'R' ||
				letter === 'S' ||
				letter === 'T' ||
				letter === 'V' ||
				letter === 'W' ||
				letter === 'X' ||
				letter === 'Z'
		);
		submission(wordWithoutVowels[Math.floor(Math.random() * wordWithoutVowels.length)]);
	};

	// picks a word at random
	let random = Math.floor(Math.random() * quizData.length);
	let word = quizData[random].name.toUpperCase();
	let category = quizData[random].category;

	// give me a list of empty letters for the word
	let answerArray = [];
	let remainingLettersCorrection = 0;
	word = word.split('');
	for (let i = 0; i < word.length; i++) {
		if (word[i] === ' ') {
			answerArray[i] = ' ';
			word[i] = ' ';
			remainingLettersCorrection++;
		} else {
			answerArray[i] = '_';
		}
	}
	// how many letters are left?
	let remainingLetters = word.length - remainingLettersCorrection;

	// *** Game Loop! ***
	// while there are still letters to guess

	let guess;
	let answer;
	let totalLetters

	const submission = (guess) => {
		console.log(guessesCount)
		isLetterChosen = true;
		clickedButtons.push(guess);
		clickedButtons = clickedButtons;
		if (guess.length !== 1) {
			alert('Please enter a single letter');
		} else {
			//update the game state with the guess
			for (let j = 0; j < word.length; j++) {
				// if they were correct
				if (word[j] === guess && guess !== answerArray[j]) {
					answerArray[j] = guess;
					letters.innerHTML = answerArray.join(' ');
					if (typeof reward === 'number' && isNaN(reward) === false && guessesCount !== 0) {
						score += parseInt(reward);
					}
					remainingLetters--;
				}
			}
		}
		consonantsDisabled = true;
		vowelsDisabled = true;
		guessesCount++;
	};

	const TWO_PI = Math.PI * 2;
	const HALF_PI = Math.PI * 0.5;
	// canvas settings
	var viewWidth = 1024,
		viewHeight = 1024,
		viewCenterX = viewWidth * 0.66,
		viewCenterY = viewHeight * 0.66,
		drawingCanvas,
		ctx,
		timeStep = 1 / 60;

	var ppm = 24, // pixels per meter
		physicsWidth = viewWidth / ppm,
		physicsHeight = viewHeight / ppm,
		physicsCenterX = physicsWidth * 0.33;

	var world;
	var wheel, arrow, mouseBody, mouseConstraint;
	var arrowMaterial, pinMaterial, contactMaterial;
	var wheelSpinning = false,
		wheelStopped = true;

	var particles = [];
	let statusLabel = '';

	function initDrawingCanvas() {
		drawingCanvas.width = viewWidth;
		drawingCanvas.height = viewHeight;
		ctx = drawingCanvas.getContext('2d');

		drawingCanvas.addEventListener('mousemove', updateMouseBodyPosition);
		drawingCanvas.addEventListener('mousedown', checkStartDrag);
	}

	function updateMouseBodyPosition(e) {
		var p = getPhysicsCoord(e);
		mouseBody.position[0] = p.x;
		mouseBody.position[1] = p.y;
	}

	function checkStartDrag(e) {
		if (wheelSpinning === false) {
			if (world.hitTest(mouseBody.position, [wheel.body])[0]) {
				if (isLetterChosen === true) {
					wheel.body.angularVelocity = Math.floor(Math.random() * 101) + 10;
					wheelSpinning = true;
					wheelStopped = false;
					tmpCD = consonantsDisabled;
					tmpVD = vowelsDisabled;
					consonantsDisabled = true;
					vowelsDisabled = true;
				}
			}
		}
	}

	function getPhysicsCoord(e) {
		var rect = drawingCanvas.getBoundingClientRect(),
			x = (e.clientX - rect.left) / ppm,
			y = physicsHeight - (e.clientY - rect.top) / ppm;

		return { x: x, y: y };
	}

	function initPhysics() {
		world = new p2.World();
		world.solver.iterations = 100;
		world.solver.tolerance = 0;

		arrowMaterial = new p2.Material();
		pinMaterial = new p2.Material();
		contactMaterial = new p2.ContactMaterial(arrowMaterial, pinMaterial, {
			friction: 0.0,
			restitution: 0.1
		});
		world.addContactMaterial(contactMaterial);

		var wheelRadius = 10.6,
			wheelX = physicsCenterX,
			wheelY = wheelRadius + 2.6,
			arrowX = wheelX,
			arrowY = wheelY + wheelRadius + 0.83;

		wheel = new Wheel(wheelX, wheelY, wheelRadius, 32, 0.25, 10.6);
		wheel.body.angle = Math.PI / 32.5;
		wheel.body.angularVelocity = 0;
		arrow = new Arrow(arrowX, arrowY, 0.75, 1.5);
		mouseBody = new p2.Body();

		world.addBody(mouseBody);
	}

	function update() {
		particles.forEach(function (p) {
			p.update();
			if (p.complete) {
				particles.splice(particles.indexOf(p), 1);
			}
		});

		// p2 does not support continuous collision detection :(
		// but stepping twice seems to help
		// considering there are only a few bodies, this is ok for now.
		world.step(timeStep * 0.5);
		world.step(timeStep * 0.5);

		if (
			wheelSpinning === true &&
			wheelStopped === false &&
			wheel.body.angularVelocity < 0.25 &&
			arrow.hasStopped()
		) {
			wheel.gotLucky();
			wheelStopped = true;
			wheelSpinning = false;
			isLetterChosen = false;
			console.log(guuessCount)
			if (guessesCount === 5) {
				consonantsDisabled = true;
				vowelsDisabled = false;
			}
			if (guessesCount === 6) {
				consonantsDisabled = true;
				vowelsDisabled = true;
			}
			if (guessesCount <= 4) {
				consonantsDisabled = false;
				vowelsDisabled = true;
			}

			wheel.body.angularVelocity = 0;
		}
	}

	function draw() {
		// ctx.fillStyle = '#fff';
		ctx.clearRect(0, 0, viewWidth, viewHeight);

		wheel.draw();
		arrow.draw();

		particles.forEach(function (p) {
			p.draw();
		});
	}

	function loop() {
		update();
		draw();

		requestAnimationFrame(loop);
	}

	/////////////////////////////
	// wheel of fortune
	/////////////////////////////
	let rewards = [
		'200',
		'300',
		'200',
		'100',
		'500',
		'100',
		'100',
		'200',
		'200',
		'100',
		'300',
		'100',
		'700',
		'Bankrut',
		'100',
		'100',
		'200',
		'300',
		'200',
		'200',
		'300',
		'100',
		'200',
		'100',
		'100',
		'100',
		'300',
		'200',
		'800',
		'Bankrut',
		'100',
		'100'
	];
	let readRewards = [
		'100',
		'200',
		'200',
		'100',
		'300',
		'100',
		'700',
		'Bankrut',
		'100',
		'100',
		'200',
		'300',
		'200',
		'200',
		'300',
		'100',
		'200',
		'100',
		'100',
		'100',
		'300',
		'200',
		'800',
		'Bankrut',
		'100',
		'100',
		'200',
		'300',
		'200',
		'100',
		'500',
		'100'
	];
	function Wheel(x, y, radius, segments, pinRadius, pinDistance) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.segments = segments;
		this.pinRadius = pinRadius;
		this.pinDistance = pinDistance;

		this.pX = this.x * ppm;
		this.pY = (physicsHeight - this.y) * ppm;
		this.pRadius = this.radius * ppm;
		this.pPinRadius = this.pinRadius * ppm;
		this.pPinPositions = [];

		this.deltaPI = TWO_PI / this.segments;

		this.createBody();
		this.createPins();
	}
	Wheel.prototype = {
		createBody: function () {
			this.body = new p2.Body({ mass: 1, position: [this.x, this.y] });
			this.body.angularDamping = 0.0;
			this.body.addShape(new p2.Circle(this.radius));
			this.body.shapes[0].sensor = true; //TODO use collision bits instead

			var axis = new p2.Body({ position: [this.x, this.y] });
			var constraint = new p2.LockConstraint(this.body, axis);
			constraint.collideConnected = false;

			world.addBody(this.body);
			world.addBody(axis);
			world.addConstraint(constraint);
		},
		createPins: function () {
			var l = this.segments,
				pin = new p2.Circle(this.pinRadius);

			pin.material = pinMaterial;

			for (var i = 0; i < l; i++) {
				var x = Math.cos((i / l) * TWO_PI) * this.pinDistance,
					y = Math.sin((i / l) * TWO_PI) * this.pinDistance;

				this.body.addShape(pin, [x, y]);
				this.pPinPositions[i] = [x * ppm, -y * ppm];
			}
		},
		gotLucky: function () {
			var currentRotation = wheel.body.angle % TWO_PI,
				currentSegment = Math.floor(currentRotation / this.deltaPI);
			let rewardsIndex;
			if (currentSegment < 0) {
				rewardsIndex = currentSegment + 32;
			} else {
				rewardsIndex = currentSegment;
			}
			reward = parseInt(readRewards[rewardsIndex]);
			if (isNaN(reward)) {
				score = 0;
			}
		},
		draw: function () {
			// TODO this should be cached in a canvas, and drawn as an image
			// also, more doodads
			ctx.save();
			ctx.translate(this.pX, this.pY);

			ctx.beginPath();
			ctx.fillStyle = '#DB9E36';
			ctx.arc(0, 0, this.pRadius + 24, 0, TWO_PI);
			ctx.fill();
			ctx.fillRect(-12, 0, 24, 400);

			ctx.rotate(-this.body.angle);

			for (var i = 0; i < this.segments; i++) {
				if (i === 15 || i === 31) {
					ctx.fillStyle = '#000000';
				} else if (i === 14 || i === 30 || i === 22) {
					ctx.fillStyle = '#daa520';
				} else if (i % 2 === 0) {
					ctx.fillStyle = '#BD4932';
				} else {
					ctx.fillStyle = '#FFFAD5';
				}
				ctx.beginPath();
				ctx.arc(0, 0, this.pRadius, i * this.deltaPI, (i + 1) * this.deltaPI);
				ctx.lineTo(0, 0);
				ctx.closePath();
				ctx.fill();
			}

			ctx.fillStyle = '#401911';

			this.pPinPositions.forEach(function (p) {
				ctx.beginPath();
				ctx.arc(p[0], p[1], this.pPinRadius, 0, TWO_PI);
				ctx.fill();
			}, this);

			let labelX = -200,
				labelY = 66.6,
				labelRotation = (46 * Math.PI) / 180,
				labelTranslateX = 0,
				labelTranslateY = 0;
			for (var i = 0; i < this.segments; i++) {
				ctx.save();

				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';

				ctx.translate(labelTranslateX, labelTranslateY);
				ctx.rotate(labelRotation);
				ctx.font = '20px verdana';
				if (i === 29 || i === 13) {
					ctx.fillStyle = 'white';
				} else {
					ctx.fillStyle = 'black';
				}

				ctx.fillText(rewards[i], labelX, labelY);

				ctx.restore();
				labelRotation += 0.197;
			}

			ctx.restore();
		}
	};
	/////////////////////////////
	// arrow on top of the wheel of fortune
	/////////////////////////////
	function Arrow(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.verts = [];

		this.pX = this.x * ppm;
		this.pY = (physicsHeight - this.y) * ppm;
		this.pVerts = [];

		this.createBody();
	}
	Arrow.prototype = {
		createBody: function () {
			this.body = new p2.Body({ mass: 1, position: [this.x, this.y] });
			this.body.addShape(this.createArrowShape());

			var axis = new p2.Body({ position: [this.x, this.y] });
			var constraint = new p2.RevoluteConstraint(this.body, axis, {
				worldPivot: [this.x, this.y]
			});
			constraint.collideConnected = false;

			var left = new p2.Body({ position: [this.x - 2, this.y] });
			var right = new p2.Body({ position: [this.x + 2, this.y] });
			var leftConstraint = new p2.DistanceConstraint(this.body, left, {
				localAnchorA: [-this.w * 2, this.h * 0.25],
				collideConnected: false
			});
			var rightConstraint = new p2.DistanceConstraint(this.body, right, {
				localAnchorA: [this.w * 2, this.h * 0.25],
				collideConnected: false
			});
			var s = 32,
				r = 4;

			leftConstraint.setStiffness(s);
			leftConstraint.setRelaxation(r);
			rightConstraint.setStiffness(s);
			rightConstraint.setRelaxation(r);

			world.addBody(this.body);
			world.addBody(axis);
			world.addConstraint(constraint);
			world.addConstraint(leftConstraint);
			world.addConstraint(rightConstraint);
		},

		createArrowShape: function () {
			this.verts[0] = [0, this.h * 0.25];
			this.verts[1] = [-this.w * 0.5, 0];
			this.verts[2] = [0, -this.h * 0.75];
			this.verts[3] = [this.w * 0.5, 0];

			this.pVerts[0] = [this.verts[0][0] * ppm, -this.verts[0][1] * ppm];
			this.pVerts[1] = [this.verts[1][0] * ppm, -this.verts[1][1] * ppm];
			this.pVerts[2] = [this.verts[2][0] * ppm, -this.verts[2][1] * ppm];
			this.pVerts[3] = [this.verts[3][0] * ppm, -this.verts[3][1] * ppm];

			var shape = new p2.Convex(this.verts);
			shape.material = arrowMaterial;

			return shape;
		},
		hasStopped: function () {
			var angle = Math.abs(this.body.angle % TWO_PI);

			return angle < 1e-3 || TWO_PI - angle < 1e-3;
		},
		update: function () {},
		draw: function () {
			ctx.save();
			ctx.translate(this.pX, this.pY);
			ctx.rotate(-this.body.angle);

			ctx.fillStyle = '#401911';

			ctx.beginPath();
			ctx.moveTo(this.pVerts[0][0], this.pVerts[0][1]);
			ctx.lineTo(this.pVerts[1][0], this.pVerts[1][1]);
			ctx.lineTo(this.pVerts[2][0], this.pVerts[2][1]);
			ctx.lineTo(this.pVerts[3][0], this.pVerts[3][1]);
			ctx.closePath();
			ctx.fill();

			ctx.restore();
		}
	};
</script>

<svelte:head>
	<title>Hyperspace by HTML5 UP</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
	<link rel="stylesheet" href="/assets/css/main.css" />
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/p2.js/0.6.0/p2.min.js"
		integrity="sha512-07h10NGs6z2Bh1dfcJ14CFNQkLz+xwOYRwHB4kXH00iNdedcnxOuF+9cxqGmY6tMw8BIUV2hik2GNLhCwELtUg=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"></script>
</svelte:head>

<Keystroke
	on:combo={({ detail }) => {
		switch (detail) {
			case 'Alt+x':
				for (let j = 0; j < word.length; j++) {
					answerArray[j] = word[j];
					letters.innerHTML = answerArray.join(' ');
				}
				break;
			case 'Alt+c':
				clickedButtons = [];
				letters.innerHTML = answerArray.join(' ');
				random = Math.floor(Math.random() * quizData.length);
				word = quizData[random].name.toUpperCase();
				category = quizData[random].category;

				// give me a list of empty letters for the word
				answerArray = [];
				remainingLettersCorrection = 0;
				word = word.split('');
				for (let i = 0; i < word.length; i++) {
					if (word[i] === ' ') {
						answerArray[i] = ' ';
						word[i] = ' ';
						remainingLettersCorrection++;
					} else {
						answerArray[i] = '_';
					}
				}
				// how many letters are left?
				remainingLetters = word.length - remainingLettersCorrection;

				// *** Game Loop! ***
				// while there are still letters to guess

				guess;
				answer;
				consonantsDisabled = false;
				vowelsDisabled = true;
				letters.innerHTML = answerArray.join(' ');
				let wordWithoutVowels = word;
				wordWithoutVowels = wordWithoutVowels.filter(
					(letter) =>
						letter === 'B' ||
						letter === 'C' ||
						letter === 'D' ||
						letter === 'F' ||
						letter === 'G' ||
						letter === 'H' ||
						letter === 'J' ||
						letter === 'K' ||
						letter === 'L' ||
						letter === 'M' ||
						letter === 'N' ||
						letter === 'P' ||
						letter === 'Q' ||
						letter === 'R' ||
						letter === 'S' ||
						letter === 'T' ||
						letter === 'V' ||
						letter === 'W' ||
						letter === 'X' ||
						letter === 'Z'
				);
				guessesCount = 0;
				submission(wordWithoutVowels[Math.floor(Math.random() * wordWithoutVowels.length)]);
				break;
			case 'Alt+v':
				let name = prompt('Wprowadź nick');
				if (name) {
					leaderboardEntries = get(leaderboardData);
					leaderboardData.set([...leaderboardEntries, { score: score, name: name }]);
				}
				break;
			case 'Alt+Delete':
				leaderboardData.set([]);
				break;
		}
	}}
/>

<body>
	{#if isLangChoosen === false}
		<div class="flex items-center justify-center w-screen h-screen">
			<form
				class="flex flex-col items-center justify-center p-10 bg-gray-200 rounded shadow-md"
				on:submit|preventDefault
			>
				<p class="mb-5 text-3xl text-gray-600 uppercase">Wybierz język</p>
				<button
					class="p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 w-80 disabled:bg-gray-500"
					id="login"
					type="submit"
					on:click={() => chooseLang('JP')}
					><span>Japoński</span>
				</button>
				<button
					class="p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 w-80 disabled:bg-gray-500"
					id="login"
					type="submit"
					on:click={() => chooseLang('ENG')}
					><span>Angielski</span>
				</button>
				<br />
			</form>
		</div>
	{/if}
	<!-- Sidebar -->
	<section id="sidebar" class="select-none">
		<div class="inner">
			<nav>
				<ul class="relative bottom-[22vh] {isSidebarHidden}">
					<li><a href="#lorem">Tablica Wyników:</a></li>
					{#each leaderboardEntries as { score, name }, i}
						<a href="#ipsum">{name}: {score}</a>
					{/each}
				</ul>
				<div class="absolute bottom-[5vh] {isSidebarHidden}">
					<button
						type="button"
						on:click={() => submission('A')}
						disabled={vowelsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
						>A</button
					>
					<button
						type="button"
						on:click={() => submission('B')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>B</button
					>
					<button
						type="button"
						on:click={() => submission('C')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>C</button
					>
					<button
						type="button"
						on:click={() => submission('D')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>D</button
					>
					<button
						type="button"
						on:click={() => submission('E')}
						disabled={vowelsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
						>E</button
					>
					<button
						type="button"
						on:click={() => submission('F')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>F</button
					>
					<button
						type="button"
						on:click={() => submission('G')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>G</button
					>
					<button
						type="button"
						on:click={() => submission('H')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>H</button
					>
					<button
						type="button"
						on:click={() => submission('I')}
						disabled={vowelsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
						>I</button
					>
					<button
						type="button"
						on:click={() => submission('J')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>J</button
					>
					<button
						type="button"
						on:click={() => submission('K')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>K</button
					>
					<button
						type="button"
						on:click={() => submission('L')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>L</button
					>
					<button
						type="button"
						on:click={() => submission('M')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>M</button
					>
					<button
						type="button"
						on:click={() => submission('N')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>N</button
					>
					<button
						type="button"
						on:click={() => submission('O')}
						disabled={vowelsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
						>O</button
					>

					<button
						type="button"
						on:click={() => submission('P')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>P</button
					>
					<button
						type="button"
						on:click={() => submission('Q')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>Q</button
					>
					<button
						type="button"
						on:click={() => submission('R')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>R</button
					>
					<button
						type="button"
						on:click={() => submission('S')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>S</button
					>
					<button
						type="button"
						on:click={() => submission('T')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>T</button
					>
					<button
						type="button"
						on:click={() => submission('U')}
						disabled={vowelsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
						>U</button
					>
					<button
						type="button"
						on:click={() => submission('V')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>V</button
					>
					<button
						type="button"
						on:click={() => submission('W')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>W</button
					>
					<button
						type="button"
						on:click={() => submission('X')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>X</button
					>
					<button
						type="button"
						on:click={() => submission('Y')}
						disabled={vowelsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-red-800 disabled:text-gray-300 hover:bg-red-700 hover:shadow-lg"
						>Y</button
					>
					<button
						type="button"
						on:click={() => submission('Z')}
						disabled={consonantsDisabled}
						class="text-4xl font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded-full shadow-md disabled:opacity-70 w-14 h-14 disabled:bg-blue-800 disabled:text-gray-300 hover:bg-blue-700 hover:shadow-lg"
						>Z</button
					>
					<a href="#anime">Użyte litery: {clickedButtons}</a>
				</div>
			</nav>
		</div>
	</section>

	<!-- Wrapper -->
	<div id="wrapper" class="select-none">
		<!-- Intro -->
		<section id="intro" class="relative wrapper style1 fullscreen">
			<div class="relative bottom-[20vh]">
				<center>
					<h2 class="opacity-[90%] text-4xl font-bold py-5 text-white">Kategoria: {category}</h2>
					<h2 class="opacity-[90%] text-4xl font-bold py-5 text-white">Wynik: {score}</h2>
					<!-- svelte-ignore a11y-missing-content -->
					<h1 id="letters" class="text-2xl text-white" bind:this={letters} />
				</center>
			</div>
			<div class="inner">
				<div class="opacity-0">Count: {score}</div>
				<div id="container" class="centered">
					<canvas id="drawing_canvas" bind:this={drawingCanvas} />
					<div
						id="status_label"
						class="opacity-[90%] text-4xl font-bold py-5 text-white text-center"
					>
						{statusLabel}
					</div>
				</div>
			</div>
		</section>
	</div>
</body>

<style>
	#letters {
		font-size: 50px;
	}
	.centered {
		position: absolute;
		margin: auto;
		top: 0;
		bottom: 0;
		left: 23%;
		right: 0;
	}

	#container {
		width: 1024px;
		height: 1024px;
	}

	#drawing_canvas {
		position: absolute;
	}
</style>
