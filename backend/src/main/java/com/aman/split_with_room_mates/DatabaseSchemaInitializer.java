package com.aman.split_with_room_mates;

import java.sql.Connection;
import java.sql.Statement;
import javax.sql.DataSource;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@AllArgsConstructor
@Slf4j
public class DatabaseSchemaInitializer implements CommandLineRunner {

    private final DataSource dataSource;

    @Override
    public void run(String... args) {
        log.info("Ensuring database tables have AUTO_INCREMENT primary keys...");
        try (Connection conn = dataSource.getConnection(); Statement stmt = conn.createStatement()) {
            String[] alterQueries = {
                "ALTER TABLE user MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT",
                "ALTER TABLE rooms MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT",
                "ALTER TABLE items MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT",
                "ALTER TABLE owemoney MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT",
                "ALTER TABLE password_reset_token MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT"
            };

            for (String query : alterQueries) {
                try {
                    stmt.executeUpdate(query);
                    log.info("Database schema update executed successfully: {}", query);
                } catch (Exception e) {
                    log.warn("Database schema update notice for '{}': {}", query, e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Could not run database schema initializer: {}", e.getMessage());
        }
    }
}
