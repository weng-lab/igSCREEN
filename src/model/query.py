import os
import psycopg2
from psycopg2 import sql, OperationalError

def main():
    # read creds from environment (or hard-code for testing)
    DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_USER = os.getenv("DB_USER", "db-user")
    DB_PASS = os.getenv("DB_PASS", "Yez9Teih35KON5h141R8p&")
    DB_NAME = os.getenv("DB_NAME", "genes-db")

    try:
        # connect to Postgres via the proxy
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASS,
            dbname=DB_NAME
        )
        with conn:
            with conn.cursor() as cur:
                # schema-qualified count query
                cur.execute(
                    sql.SQL("SELECT COUNT(name) FROM {}.{};")
                       .format(
                           sql.Identifier("gencode_02_29_2024"),
                           sql.Identifier("gene_grch38_29")
                       )
                )
                row_count = cur.fetchone()[0]
                print(f"Total rows in gencode_02_29_2024.gene_grch38_29: {row_count}")

    except OperationalError as e:
        print("Database error:", e)
    finally:
        if 'conn' in locals() and conn:
            conn.close()

if __name__ == "__main__":
    main()
