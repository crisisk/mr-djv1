#!/bin/bash

# Function to escape strings for safe sed replacement
escape_sed_replacement() {
    local str="$1"
    str=${str//\/\\}
    str=${str//&/\&}
    str=${str//\//\/}
    printf '%s' "$str"
}

# Function to safely run sed replacement with error handling
run_sed_replace() {
    local file="$1"
    local placeholder="$2"
    local replacement="$3"

    if ! sed -i.bak "s/${placeholder}/${replacement}/g" "$file"; then
        echo "Error: Failed to replace ${placeholder} in ${file}." >&2
        if [ -f "${file}.bak" ]; then
            mv "${file}.bak" "$file"
        fi
        exit 1
    fi

    if grep -Fq -- "$placeholder" "$file"; then
        echo "Error: Placeholder ${placeholder} still present in ${file} after replacement." >&2
        if [ -f "${file}.bak" ]; then
            mv "${file}.bak" "$file"
        fi
        exit 1
    fi

    rm -f "${file}.bak"
}

# Function to create a template slide
create_template() {
    local file=$1
    local title=$2
    local description=$3

    cat > "$file" << 'EOF'
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TITLE_PLACEHOLDER</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Montserrat', sans-serif;
            background: #1A2C4B;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .slide-container {
            width: 1280px;
            min-height: 720px;
            background: linear-gradient(135deg, #1A2C4B 0%, #2D3A45 100%);
            padding: 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        h1 {
            font-size: 48px;
            font-weight: 800;
            color: #00AEEF;
            margin-bottom: 30px;
        }
        .description {
            font-size: 24px;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.6;
            max-width: 900px;
        }
        .placeholder {
            margin-top: 60px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px dashed rgba(0, 174, 239, 0.3);
            border-radius: 20px;
            text-align: center;
        }
        .placeholder-text {
            font-size: 20px;
            color: #D4AF37;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <h1>TITLE_PLACEHOLDER</h1>
        <p class="description">DESC_PLACEHOLDER</p>
        <div class="placeholder">
            <p class="placeholder-text">📝 Template Slide - Te vullen met content</p>
        </div>
    </div>
</body>
</html>
EOF
    
    # Replace placeholders with escaped values and error checking
    local escaped_title
    escaped_title=$(escape_sed_replacement "$title")
    run_sed_replace "$file" "TITLE_PLACEHOLDER" "$escaped_title"

    local escaped_description
    escaped_description=$(escape_sed_replacement "$description")
    run_sed_replace "$file" "DESC_PLACEHOLDER" "$escaped_description"
}

# Create template slides (these will be filled later)
create_template "intro.html" "Design System Overview" "Introductie van het design system: doel, scope, en voordelen voor consistente gebruikerservaringen."

create_template "atoms_inputs.html" "Atoms: Form Inputs" "Text inputs, textareas, selects, checkboxes, radio buttons, en toggle switches met alle states."

create_template "atoms_icons.html" "Atoms: Icons & Badges" "Icon library met 50+ icons, badge components voor status indicators en labels."

create_template "molecules_navigation.html" "Molecules: Navigation" "Header, navbar, breadcrumbs, pagination, tabs en mobile responsive navigation patterns."

create_template "molecules_forms.html" "Molecules: Form Groups" "Form layouts, field groups, inline validation, error messages en helper text."

create_template "organisms_testimonials.html" "Organisms: Testimonial Sections" "Review cards, rating displays, client logos, carousel layouts voor social proof."

create_template "organisms_gallery.html" "Organisms: Media Galleries" "Image grids, lightbox, video players, before/after sliders en responsive masonry layouts."

create_template "organisms_contact.html" "Organisms: Contact Sections" "Contact forms, info cards, maps integration, social links en multi-step forms."

create_template "templates_service.html" "Templates: Service Pages" "Service page layouts voor bruiloften, bedrijfsfeesten, DJ+Sax met feature grids."

create_template "templates_booking.html" "Templates: Booking Flow" "Multi-step booking process: date selection, package choice, add-ons, confirmation."

create_template "components_animations.html" "Animations & Transitions" "Micro-interactions, page transitions, scroll animations, loading states."

create_template "components_responsive.html" "Responsive Patterns" "Breakpoints (mobile, tablet, desktop, wide) en responsive component behavior."

create_template "components_accessibility.html" "Accessibility Features" "WCAG 2.1 AA compliance, keyboard navigation, screen reader support, ARIA labels."

create_template "components_performance.html" "Performance Optimization" "Code splitting, lazy loading, image optimization, Core Web Vitals targets."

create_template "documentation.html" "Component Documentation" "Storybook integration, prop tables, usage examples, do's and don'ts."

echo "✅ Template slides created!"
