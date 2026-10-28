# 2. Requirement Analysis

Zahtjevi aplikacije **Lost & Found** temelje se na [projektnom zadatku](./assets/Lost_and_Found_Projektni_zadatak_261012_155026.pdf) (odjeljci 1–3), [opsegu projekta](./1-Project-Scope.md) i [slučajevima uporabe](./3-use-cases.md). Svaki ima oznaku, prioritet i kriterij prihvaćanja. Značajne promjene bilježe se u odjeljku 2.5.

**High** označava osnovne funkcionalnosti i zaštitu podataka, a **Medium** podudaranja i obavijesti. Svi zahtjevi ostaju u opsegu, neovisno o prioritetu.

## 2.1 Functional Requirements

| ID | Description | Priority | Source | Acceptance criteria |
| --- | --- | --- | --- | --- |
| F-001 | Sustav omogućuje pregled i pretraživanje objava bez prijave te filtriranje prema vrsti, kategoriji, lokaciji i vremenu. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Korisnik odabire ponuđene ključne riječi za predmet koji traži; ako odgovarajuće nema, unosi vlastiti tekst pod „ostalo”. Kombinirani kriteriji vraćaju samo odgovarajuće objave; ako ih nema, prikazuje se obavijest i omogućuje promjena kriterija. |
| F-002 | Sustav prikazuje javne podatke objave i lokaciju na karti. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Dostupni su vrsta, kategorija, naziv, opis, datum ili približno vrijeme, status povrata, lokacija i fotografija ako postoji. Vrsta objave je „izgubljeno” ili „pronađeno”; status „na čekanju” znači da je predmet pronađen, ali nije uručen, a „predano” da ga je pronalazitelj označio predanim. |
| F-003 | Sustav omogućuje prijavu preko vanjskog pružatelja identiteta putem OAuth 2.0. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Uspješna provjera odgovora pružatelja uspostavlja sesiju i dopušta radnje prema ulozi. Odustajanje ili neuspjeh ne daje pristup zaštićenim radnjama; javni pregled ostaje dostupan. |
| F-004 | Prijavljeni korisnik može objaviti izgubljeni ili pronađeni predmet. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Spremaju se vrsta, kategorija, naziv, opis, datum ili približno vrijeme te lokacija; fotografija i skriveni detalj su neobvezni. Pri opisu predmeta korisnik odabire ponuđene ključne riječi, a ako odgovarajuće nema, upisuje vlastiti tekst pod „ostalo”; odabir i unos spremaju se uz objavu. Nepotpuni ili neispravni obvezni podaci traže ispravak i ne stvaraju objavu. |
| F-005 | Korisnik može odrediti lokaciju GPS-om ili ručnim odabirom na karti. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Odabrana lokacija sprema se uz objavu i prikazuje u detaljima; odbijeno dopuštenje ili nedostupan GPS ne sprječava ručni odabir. |
| F-006 | Autor može urediti vlastitu objavu. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Valjane izmjene autora vidljive su nakon ponovnog otvaranja; nevaljane izmjene i pokušaji drugog korisnika odbijaju se bez promjene podataka. Skriveni detalj ostaje nejavan. |
| F-007 | Autor može ukloniti vlastitu objavu iz javnog prikaza. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Potvrđeno uklanjanje čini objavu javno nedostupnom; odustajanje je ne mijenja. Drugi korisnik ne može ukloniti objavu ovom radnjom. |
| F-008 | Prijavljeni korisnik može poslati zahtjev za povrat dostupnog pronađenog predmeta uz obrazloženje vlasništva. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Valjan zahtjev dostupan je autoru i podnositelju sa statusom čekanja odluke; nije javan. Nedostatak obveznih informacija ili nedostupna objava sprječava spremanje. Podnositelj može povući svoj zahtjev; povlačenje se prikazuje obama sudionicima. |
| F-009 | Autor povezane objave može pregledati informacije iz zahtjeva, usporediti obilježja sa skrivenim detaljem ako postoji te prihvatiti ili odbiti zahtjev. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Samo autor donosi i može promijeniti odluku; aktualni status vide oba sudionika. Prihvaćanje ne označava automatski izvršenu fizičku predaju; pronalazitelj zasebno označava predmet predanim. |
| F-010 | Sudionici mogu pregledati svoje poslane i primljene zahtjeve te njihove statuse. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Pregled sadrži samo zahtjeve u kojima korisnik sudjeluje i aktualne statuse; prazan pregled ima odgovarajuću obavijest. Izravan pristup tuđem zahtjevu odbija se. |
| F-011 | Autor objave i podnositelj poslanog zahtjeva mogu razmjenjivati privatne poruke radi provjere vlasništva i dogovora predaje. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Poruka je nakon spremanja dostupna drugom sudioniku; razgovor je dostupan i prije prihvaćanja zahtjeva. Treća osoba ne može čitati ni slati poruke u tom razgovoru. |
| F-012 | Sustav predlaže moguća podudaranja izgubljenih i pronađenih predmeta prema kategoriji, opisu, vremenu i lokaciji. | Medium | Projektni zadatak, odjeljak 2. | Korisnik može pregledati predložene objave i otvoriti njihove detalje. Ako nema mogućih podudaranja, sustav prikazuje odgovarajuću obavijest. Prijedlog podudaranja nije potvrda vlasništva. Pravila usporedbe potrebno je razraditi tijekom projektiranja. |
| F-013 | Korisnik može uključiti obavijesti u aplikaciji o mogućim podudaranjima svojih izgubljenih predmeta. | Medium | Projektni zadatak, odjeljak 2. | Kada je uključio obavijesti, korisnik dobiva obavijest u aplikaciji o novoj objavi koja prema kategoriji, opisu, vremenu ili lokaciji odgovara njegovoj objavi izgubljenog predmeta. Bez uključivanja ili novog odgovarajućeg podudaranja ne stvara se obavijest. |
| F-014 | Prijavljeni korisnik može prijaviti sumnjivu, netočnu ili neprimjerenu objavu uz navođenje razloga. | High | Projektni zadatak, odjeljak 2; dogovor tima 28. listopada 2026. | Prijava s razlogom postaje dostupna administratoru; prazan razlog traži dopunu. Neprijavljenom korisniku slanje prijave nije dopušteno. Sama prijava ne uklanja objavu. |
| F-015 | Administrator može pregledati prijave i ukloniti neprimjerenu objavu. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Administrator vidi razlog i povezanu objavu; potvrđeno uklanjanje čini je javno nedostupnom. Neopravdana prijava ne zahtijeva uklanjanje. Korisnik bez administratorske uloge ne može pristupiti moderiranju. |

## 2.2 Non-Functional Requirements

Navedene provjere predstavljaju očekivane kriterije kvalitete. Rezultati provjera bilježe se u poglavlju o testiranju.

| ID | Description | Priority | Source |
| --- | --- | --- | --- |
| NF-001 | Skriveni detalji predmeta, sadržaj zahtjeva i privatne poruke ne smiju biti dostupni neovlaštenim korisnicima ni kroz sučelje ni izravnim zahtjevom poslužitelju. Provjera: usporediti pristup autora, sudionika, trećeg korisnika i neprijavljenog posjetitelja. | High | Projektni zadatak odjeljci 1–2; Opseg, odjeljak 1.1 i odjeljak 1.3; UC-002, UC-007–UC-010. |
| NF-002 | Poslužitelj mora provjeriti identitet i ovlasti pri svakoj zaštićenoj radnji. Provjera: bez sesije, s nevaljanom sesijom i kao drugi korisnik pokušati uređivanje, uklanjanje, obradu zahtjeva i moderiranje; pristup se odbija bez promjene podataka. | High | UC-003, UC-005, UC-006, UC-008, UC-014; razrada ograničenja pristupa. |
| NF-003 | Osnovni pregled, pretraživanje, objava i slanje zahtjeva moraju biti uporabivi u mobilnom pregledniku. Provjera: na mobilnom prikazu svi potrebni unosi i radnje dostupni su bez vodoravnog pomicanja stranice. | High | Projektni zadatak, odjeljak 3; Opseg, odjeljak 1.3. |
| NF-004 | Odbijanje dopuštenja za GPS ne smije onemogućiti objavu: korisnik može ručno odabrati lokaciju. Ako se karta u detaljima ne učita, ostali javni podaci ostaju vidljivi uz obavijest o nedostupnoj karti. | High | Projektni zadatak, odjeljak 2; Opseg, odjeljak 1.3; UC-002, UC-004. |
| NF-005 | Neuspjelo spremanje objave, zahtjeva, odluke ili poruke mora dati vidljivu pogrešku bez lažne potvrde uspjeha. Provjera: izazvati neuspjeh spremanja u testnom okruženju za svaku navedenu radnju i provjeriti poruku te pohranjeno stanje. | High | Alternativni tijekovi UC-004, UC-007, UC-008, UC-010. |

Numerički ciljevi odziva, broja istodobnih korisnika i dostupnosti nisu utvrđeni u postojećim izvorima; ne preuzimaju se vrijednosti iz nastavnih primjera.

## 2.3 Stakeholders and Actors

| Role or actor ID | Relation to the system | Relevant requirements |
| --- | --- | --- |
| A-01 Posjetitelj | Neprijavljeni korisnik pregledava javne objave i pokreće prijavu. | F-001–F-003 |
| A-02 Prijavljeni korisnik | Student ili zaposlenik; ovisno o radnji nastupa kao autor objave, pronalazitelj ili podnositelj zahtjeva. Autor i podnositelj nisu zasebne trajne uloge računa. | F-001–F-014; NF-001–NF-005. |
| A-03 Administrator | Prijavljuje se, pregledava prijave i uklanja neprimjeren sadržaj. Administratorska uloga sama po sebi ne daje pristup privatnim razgovorima. | F-003, F-015; NF-001, NF-002. |
| A-04 Vanjski pružatelj identiteta | Vanjski sustav sudjeluje u prijavi korisnika. | F-003; NF-002. |
| A-05 Usluga karata | Vanjski sustav omogućuje prikaz i odabir lokacije. GPS ovisi i o pregledniku odnosno uređaju. | F-002, F-005; NF-004. |
| S-01 Projektni tim | Dionik odgovoran za razvoj i usklađivanje zahtjeva; nema posebnu aplikacijsku ulogu. | Svi zahtjevi. |
| S-02 Nastavno osoblje kolegija | Dionik koji prati i vrednuje projekt; nema posebnu aplikacijsku ulogu. | Opseg projekta i provjerljivost zahtjeva. |

Izvori: Opseg, odjeljak 1.2 i dijagram te opisi slučajeva uporabe.

## 2.4 Constraints and Assumptions

| ID | Constraint or assumption | Source | Consequence or way to verify |
| --- | --- | --- | --- |
| C-01 | Prijava se ostvaruje preko vanjskog pružatelja identiteta putem OAuth 2.0. | Projektni zadatak, odjeljak 2; Opseg, odjeljak 1.3; UC-003. | Tim odabire pružatelja tijekom projektiranja; provjeriti uspješnu, otkazanu i neuspjelu prijavu. |
| C-02 | Lokacija ovisi o vanjskoj usluzi karata; GPS ovisi o uređaju i dopuštenju korisnika. | Projektni zadatak odjeljci 2–3; Opseg, odjeljak 1.3. | Osigurati ručni odabir lokacije i provjeriti uskraćeno GPS dopuštenje te nedostupnost karte prema NF-004. |
| C-03 | Predaja, dostava i fizičko čuvanje predmeta izvan su sustava. | Projektni zadatak, odjeljak 2; Opseg, odjeljak 1.3; UC-008, UC-010. | Sustav omogućuje dogovor; prihvaćen zahtjev nije dokaz izvršene predaje. |
| C-04 | Sustav pomaže u procjeni vlasništva, ali ga ne jamči. | Opseg odjeljak 1.1 i odjeljak 1.3; UC-011. | Odluku o zahtjevu donosi autor objave; prijedlog podudaranja nije potvrda vlasništva. |
| C-05 | Razvija se web-aplikacija prilagođena mobilnim uređajima, bez zasebne mobilne aplikacije. | Projektni zadatak, odjeljak 3; Opseg, odjeljak 1.3. | Provjeriti mobilni prikaz prema NF-003. |
| C-06 | Prijavljivanje problematičnih objava dostupno je samo prijavljenim korisnicima. | Dogovor tima, 28. listopada 2026. | Provjeriti da prijavljeni korisnik može poslati prijavu, a neprijavljeni ne može. |
| AS-03 | Odabrane vanjske usluge bit će dostupne u razvojnom i demonstracijskom okruženju. | Vanjske ovisnosti iz opsega odjeljak 1.3. | Provjeriti konfiguraciju, uvjete korištenja i dostupnost pri integraciji; trenutačni izvori ne određuju pružatelje ni jamstva dostupnosti. |

## 2.5 Significant Requirement Changes

U nastavku su zabilježene značajne dopune zahtjeva tijekom njihove razrade.

| Date | Requirement ID | Change and reason | Agreed with / evidence |
| --- | --- | --- | --- |
| 2026-10-28 | F-014, C-06 | Određeno je da samo prijavljeni korisnici mogu prijavljivati problematične objave. | Dogovor projektnog tima. |

Ključne riječi i unos „ostalo” koriste se pri objavi i traženju predmeta. Tim periodično pregledava unose „ostalo” radi poboljšanja filtara; automatsko dodavanje riječi nije zahtjev. Pravila za višestruke zahtjeve i zahtjeve za vlastitu objavu još nisu definirana.

## 2.6 Requirement Traceability

Slučajevi uporabe povezani su u nastavku. Sve navedene provjere su **planirane, nisu izvršene**. Projektne testove i ručne postupke treba dokumentirati u [odjeljku 5.2](./5-Testing.md#52-test-cases), a rezultate u odjeljku 5.3. Nastavni primjeri u tom poglavlju nisu projektni testovi.

| Requirement ID | Use case or design location | Test or verification location |
| --- | --- | --- |
| F-001 | UC-001 — [opis](./3-use-cases.md#uc-001-pregledati-pretražiti-i-filtrirati-objave). | Pregled bez prijave, pretraživanje, kombiniranje filtara prema vrsti, kategoriji, lokaciji i vremenu te prikaz praznog rezultata. |
| F-002 | UC-002 — [opis](./3-use-cases.md#uc-002-pregledati-detalje-objave). | Prikaz javnih detalja, statusa, lokacije i fotografije ako postoji; skriveni detalj nije javan; uklonjena objava nije dostupna. |
| F-003 | UC-003 — [opis](./3-use-cases.md#uc-003-prijaviti-se). | Uspješna, otkazana i neuspjela prijava putem OAuth 2.0; dostupnost radnji prema korisničkoj ulozi. |
| F-004 | UC-004 — [opis](./3-use-cases.md#uc-004-objaviti-izgubljeni-ili-pronađeni-predmet). | Valjana objava izgubljenog i pronađenog predmeta; nedostatak obveznih podataka; objava s fotografijom i skrivenim detaljem te bez njih. |
| F-005 | UC-004, UC-005 — [opisi](./3-use-cases.md). | Određivanje lokacije GPS-om i ručnim odabirom na karti; provjera spremljene lokacije nakon objave ili izmjene. |
| F-006 | UC-005 — [opis](./3-use-cases.md#uc-005-urediti-vlastitu-objavu). | Uređivanje kao autor; odbijanje uređivanja drugog korisnika; odbijanje nevaljanih podataka bez promjene postojeće objave. |
| F-007 | UC-006 — [opis](./3-use-cases.md#uc-006-ukloniti-vlastitu-objavu). | Potvrđeno i otkazano uklanjanje; odbijanje uklanjanja drugog korisnika; nedostupnost uklonjene objave u javnom prikazu. |
| F-008 | UC-007 — [opis](./3-use-cases.md#uc-007-zatražiti-povrat-predmeta). | Slanje valjanog zahtjeva; odbijanje nepotpunog zahtjeva i zahtjeva za nedostupnu objavu; privatnost sadržaja zahtjeva. |
| F-009 | UC-008 — [opis](./3-use-cases.md#uc-008-prihvatiti-ili-odbiti-zahtjev-za-povrat). | Prihvaćanje i odbijanje zahtjeva; pregled informacija za procjenu vlasništva; prikaz odluke obama sudionicima; odbijanje neovlaštenog pokušaja obrade. |
| F-010 | UC-009 — [opis](./3-use-cases.md#uc-009-pratiti-status-zahtjeva). | Pregled poslanih i primljenih zahtjeva i njihovih statusa; prazan popis; odbijanje pristupa tuđem zahtjevu. |
| F-011 | UC-010 — [opis](./3-use-cases.md#uc-010-razmjenjivati-privatne-poruke). | Razmjena poruka nakon slanja zahtjeva, uključujući prije prihvaćanja; dostupnost spremljene poruke drugom sudioniku; zabrana pristupa trećoj osobi. |
| F-012 | UC-011 — [opis](./3-use-cases.md#uc-011-pregledati-moguća-podudaranja). | Prikaz mogućih podudaranja i otvaranje njihovih detalja; obavijest kada nema podudaranja. Konkretne testne primjere dopuniti nakon razrade pravila usporedbe. |
| F-013 | UC-012 — [opis](./3-use-cases.md#uc-012-uključiti-obavijesti-i-pregledati-obavijesti-o-podudaranjima). | Uključivanje obavijesti; prikaz obavijesti o novom mogućem podudaranju; izostanak nove obavijesti kada obavijesti nisu uključene ili nema odgovarajućeg podudaranja. |
| F-014 | UC-013 — [opis](./3-use-cases.md#uc-013-prijaviti-problematičnu-objavu). | Slanje prijave kao prijavljeni korisnik; odbijanje slanja bez prijave; obvezan razlog; izostanak automatskog uklanjanja prijavljene objave. |
| F-015 | UC-014 — [opis](./3-use-cases.md#uc-014-pregledati-prijave-i-ukloniti-neprimjeren-sadržaj). | Pregled prijava i uklanjanje sadržaja kao administrator; postupanje s opravdanom i neopravdanom prijavom; odbijanje pristupa korisniku bez administratorskih ovlasti. |
| NF-001 | UC-002, UC-007–UC-010 — [opisi](./3-use-cases.md). | Provjeriti pristup skrivenim detaljima, zahtjevima i privatnim porukama kao autor, sudionik, treći korisnik i neprijavljeni posjetitelj. Provjeriti sučelje i izravne zahtjeve poslužitelju. |
| NF-002 | UC-003, UC-005, UC-006, UC-008, UC-014 — [opisi](./3-use-cases.md). | Pokušati zaštićene radnje bez sesije, s nevaljanom sesijom i kao korisnik bez potrebnih ovlasti; potvrditi odbijanje i izostanak promjene podataka. |
| NF-003 | Projektni zadatak, odjeljak 3; UC-001, UC-004, UC-007. | Provjeriti pregled, pretraživanje, objavljivanje i slanje zahtjeva u mobilnom pregledniku. Zabilježiti uređaj i širinu prikaza te provjeriti dostupnost potrebnih unosa i radnji bez vodoravnog pomicanja stranice. |
| NF-004 | UC-002, UC-004 — [opisi](./3-use-cases.md). | Odbiti dopuštenje za GPS i ručno odabrati lokaciju. Zasebno onemogućiti učitavanje karte u detaljima i provjeriti dostupnost ostalih javnih podataka uz obavijest o pogrešci. |
| NF-005 | UC-004, UC-007, UC-008, UC-010 — [opisi](./3-use-cases.md). | U testnom okruženju izazvati neuspjeh spremanja objave, zahtjeva, odluke i poruke. Provjeriti prikaz pogreške, pohranjeno stanje i izostanak lažne potvrde uspjeha. |
## 2.7 Review of Requirements

Slučajeve uporabe potrebno je održavati usklađenima sa zahtjevima te povezati stvarne projektne testove kada budu izrađeni.

| Checkpoint | Feedback or finding | Resulting requirement or scope decision |
| --- | --- | --- |
| Prva formalna kontrolna točka | Povratne informacije još nisu dokumentirane. | nakon pregleda povezati stvarne zaključke i eventualne promjene u odjeljku 2.5. |
| Završna formalna kontrolna točka | Povratne informacije još nisu dokumentirane. | uskladiti zahtjeve s dogovorenim opsegom i dokazima provjere. |

Termine kontrolnih točaka treba provjeriti prema uputama kolegija. Slučajeve uporabe treba uskladiti s razradom u 2.5, posebno UC-013 koji još zahtijeva prijavu, te povezati stvarne projektne testove.
