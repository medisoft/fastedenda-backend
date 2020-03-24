--
-- PostgreSQL database dump
--

-- Dumped from database version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: faste
--

CREATE TABLE public.brands (
    id integer NOT NULL,
    name character varying(128) NOT NULL
);


ALTER TABLE public.brands OWNER TO faste;

--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: faste
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.brands_id_seq OWNER TO faste;

--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faste
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: faste
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    parent_id integer,
    task_id character varying(16) NOT NULL,
    action character varying(16),
    image character varying(256),
    orderby integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.categories OWNER TO faste;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: faste
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO faste;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faste
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: faste
--

CREATE TABLE public.inventory (
    item_id integer NOT NULL,
    provider_id integer NOT NULL,
    available numeric(16,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public.inventory OWNER TO faste;

--
-- Name: items; Type: TABLE; Schema: public; Owner: faste
--

CREATE TABLE public.items (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    base_price numeric(10,2) DEFAULT 0.0 NOT NULL,
    image character varying(256) NOT NULL,
    brand_id integer NOT NULL,
    custom_fields jsonb DEFAULT '{"description": "Description Missing"}'::jsonb NOT NULL
);


ALTER TABLE public.items OWNER TO faste;

--
-- Name: items_categories; Type: TABLE; Schema: public; Owner: faste
--

CREATE TABLE public.items_categories (
    item_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.items_categories OWNER TO faste;

--
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: faste
--

CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.items_id_seq OWNER TO faste;

--
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faste
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: faste
--

CREATE TABLE public.tasks (
    id character varying(16) NOT NULL,
    title character varying(128) NOT NULL,
    action character varying(128) NOT NULL,
    image character varying(256) NOT NULL,
    orderby integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.tasks OWNER TO faste;

--
-- Name: users; Type: TABLE; Schema: public; Owner: faste
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(64),
    password character varying(64),
    email character varying(128)
);


ALTER TABLE public.users OWNER TO faste;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: faste
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO faste;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faste
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: items id; Type: DEFAULT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: faste
--

COPY public.brands (id, name) FROM stdin;
1	N/A
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: faste
--

COPY public.categories (id, name, parent_id, task_id, action, image, orderby) FROM stdin;
3	Tocino	1	tiendita	\N	\N	0
2	Jamón	1	tiendita	\N	\N	0
6	Tocino	1	gourmet	\N	\N	0
4	Italiana	\N	platillos	\N	\N	0
11	Otros	\N	tiendita	otros	otros2.png	9999
9	Frutas y verduras	\N	tiendita	frutasyverduras	frutasyverduras2.png	4
10	Lácteos	\N	tiendita	lacteos	lacteos2.png	2
8	Enlatados	\N	tiendita	enlatados	enlatados2.png	1
12	Panadería	\N	tiendita	panaderia	panaderia2.png	5
1	Salchichonería	\N	tiendita	salchichoneria	salchichoneria2.png	3
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: faste
--

COPY public.inventory (item_id, provider_id, available) FROM stdin;
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: faste
--

COPY public.items (id, name, base_price, image, brand_id, custom_fields) FROM stdin;
1	Un producto	8.50	https://firebasestorage.googleapis.com/v0/b/faste-denda.appspot.com/o/cocacola.jpg?alt=media&token=9bda4608-fc8d-4aa5-9755-92c0e6fffac8	1	{"description": "Description Missing"}
2	Otro producto	11.25	https://firebasestorage.googleapis.com/v0/b/faste-denda.appspot.com/o/lala.jpg?alt=media&token=c21b37d9-6fff-4d6b-827d-6c46bef079ab	1	{"description": "Description Missing"}
\.


--
-- Data for Name: items_categories; Type: TABLE DATA; Schema: public; Owner: faste
--

COPY public.items_categories (item_id, category_id) FROM stdin;
1	1
2	1
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: faste
--

COPY public.tasks (id, title, action, image, orderby) FROM stdin;
gourmet	Productos Gourmet	gourmetList	productos gourmet2.png	3
platillos	Platillos Preparados	cuisineList	alimentos preparados2.png	2
tiendita	Hacer el Súper	productList	hacer el super2.png	1
farmacia	Farmacia	drugstoreList	farmacia2.png	4
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: faste
--

COPY public.users (id, username, password, email) FROM stdin;
1	mario	medina	osoverflow@gmail.com
\.


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faste
--

SELECT pg_catalog.setval('public.brands_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faste
--

SELECT pg_catalog.setval('public.categories_id_seq', 12, true);


--
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faste
--

SELECT pg_catalog.setval('public.items_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faste
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: brands brands_pk; Type: CONSTRAINT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pk PRIMARY KEY (id);


--
-- Name: categories categories_pk; Type: CONSTRAINT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pk PRIMARY KEY (id);


--
-- Name: inventory inventory_pk; Type: CONSTRAINT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pk PRIMARY KEY (provider_id, item_id);


--
-- Name: items_categories items_categories_pk; Type: CONSTRAINT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.items_categories
    ADD CONSTRAINT items_categories_pk PRIMARY KEY (category_id, item_id);


--
-- Name: items items_pk; Type: CONSTRAINT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pk PRIMARY KEY (id);


--
-- Name: tasks tasks_pk; Type: CONSTRAINT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pk PRIMARY KEY (id);


--
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- Name: brands_id_uindex; Type: INDEX; Schema: public; Owner: faste
--

CREATE UNIQUE INDEX brands_id_uindex ON public.brands USING btree (id);


--
-- Name: brands_name_uindex; Type: INDEX; Schema: public; Owner: faste
--

CREATE UNIQUE INDEX brands_name_uindex ON public.brands USING btree (name);


--
-- Name: categories_id_uindex; Type: INDEX; Schema: public; Owner: faste
--

CREATE UNIQUE INDEX categories_id_uindex ON public.categories USING btree (id);


--
-- Name: categories_name_task_id_uindex; Type: INDEX; Schema: public; Owner: faste
--

CREATE UNIQUE INDEX categories_name_task_id_uindex ON public.categories USING btree (name, task_id);


--
-- Name: items_id_uindex; Type: INDEX; Schema: public; Owner: faste
--

CREATE UNIQUE INDEX items_id_uindex ON public.items USING btree (id);


--
-- Name: tasks_id_uindex; Type: INDEX; Schema: public; Owner: faste
--

CREATE UNIQUE INDEX tasks_id_uindex ON public.tasks USING btree (id);


--
-- Name: users_email_uindex; Type: INDEX; Schema: public; Owner: faste
--

CREATE UNIQUE INDEX users_email_uindex ON public.users USING btree (email);


--
-- Name: users_id_uindex; Type: INDEX; Schema: public; Owner: faste
--

CREATE UNIQUE INDEX users_id_uindex ON public.users USING btree (id);


--
-- Name: users_username_uindex; Type: INDEX; Schema: public; Owner: faste
--

CREATE UNIQUE INDEX users_username_uindex ON public.users USING btree (username);


--
-- Name: categories categories_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_categories_id_fk FOREIGN KEY (parent_id) REFERENCES public.categories(id);


--
-- Name: categories categories_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: inventory inventory_items_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_items_id_fk FOREIGN KEY (item_id) REFERENCES public.items(id);


--
-- Name: items items_brands_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_brands_id_fk FOREIGN KEY (brand_id) REFERENCES public.brands(id);


--
-- Name: items_categories items_categories_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.items_categories
    ADD CONSTRAINT items_categories_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: items_categories items_categories_items_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: faste
--

ALTER TABLE ONLY public.items_categories
    ADD CONSTRAINT items_categories_items_id_fk FOREIGN KEY (item_id) REFERENCES public.items(id);


--
-- PostgreSQL database dump complete
--

