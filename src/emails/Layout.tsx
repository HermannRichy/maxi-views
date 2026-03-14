import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

interface LayoutProps {
    previewText: string;
    children: React.ReactNode;
}

export const Layout = ({ previewText, children }: LayoutProps) => {
    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-gray-50 my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-gray-200 rounded my-[40px] mx-auto p-[20px] max-w-[465px] bg-white">
                        <Section className="mt-[20px]">
                            {/* Remplacer par le vrai logo hébergé si besoin */}
                            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0 font-bold">
                                Maxi
                                <span className="text-[#23ce6b]">Views</span>
                            </Heading>
                        </Section>

                        {children}

                        <Hr className="border border-solid border-gray-200 my-[26px] mx-0 w-full" />
                        <Text className="text-gray-400 text-[12px] leading-[24px]">
                            Cet email a été envoyé par Maxi Views. Si vous avez
                            des questions, contactez-nous via notre support.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default Layout;
